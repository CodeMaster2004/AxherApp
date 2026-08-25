"use client";

import { SystemPermissions, SystemRoles } from "@/entities/types";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useRolePermissionAssignment } from "@/features/rolePermissionAssignment/hooks";
import { useSystemPermissions } from "@/features/systemPermissions/hooks";
import { useSystemRoles } from "@/features/systemRoles/hooks";
import Button from "@/shared/components/ui/Button";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import tableStyles from "@/shared/styles/shared/Table.module.css";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

interface Props {
    roleId: number;
    onDone?: () => void;
}

export default function RolePermissionAssignmentForm({ roleId, onDone }: Props) {
    const router = useRouter();
    const { systemRoles, loading: loadingRoles } = useSystemRoles();
    const { systemPermissions, loading: loadingPermissions } = useSystemPermissions({ initialSize: 1000 });
    const {
        loading: loadingAssigned,
        updating,
        getPermissionsByRole,
        updatePermissionsByRole,
        //error: assignmentError,
    } = useRolePermissionAssignment();

    const common = useTranslations("common");
    const t = useTranslations("permissions");
    const [baseAssignedIds, setBaseAssignedIds] = useState<number[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [statusMsg, setStatusMsg] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const role = useMemo<SystemRoles | undefined>(() =>
        systemRoles.find((r) => r.systemRoleId === roleId),
    [systemRoles, roleId]);

    useEffect(() => {
        if (!roleId) return;

        getPermissionsByRole(roleId)
        .then((permissions) => {
            const ids = Array.isArray(permissions)
            ? permissions
                .map((name) => {
                    const pm = systemPermissions.find((p) => p.permissionName === name);
                    return pm?.systemPermissionId;
                })
                .filter((id): id is number => typeof id === "number")
            : [];
            setBaseAssignedIds(ids);
            setSelectedIds(ids);
        })
        .catch ((error) => {
            setErrorMsg(t("loadError"));
        });
    }, [roleId, getPermissionsByRole, systemPermissions]);

    const groupedPermissions = useMemo(() => {
        const groups = new Map<string, SystemPermissions[]>();
        systemPermissions.forEach((perm) => {
        const m = perm.moduleName;
        if (!groups.has(m)) groups.set(m, []);
        groups.get(m)!.push(perm);
        });
        return groups;
    }, [systemPermissions]);

    const togglePermission = (id: number) => {
        setSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const diff = useMemo(() => {
        const add = selectedIds.filter((id) => !baseAssignedIds.includes(id));
        const remove = baseAssignedIds.filter((id) => !selectedIds.includes(id));
        return { add, remove };
    }, [selectedIds, baseAssignedIds]);

    const canSave = diff.add.length > 0 || diff.remove.length > 0;
    const { setAuth, user } = useAuth();

    const onSave = async () => {
        if (!roleId) return;
        setStatusMsg(null);
        setErrorMsg(null);

        try {
            await updatePermissionsByRole(roleId, {
                addPermissionIds: diff.add ?? [],
                removePermissionIds: diff.remove ?? [],
            });

            setBaseAssignedIds(selectedIds);

            // ✅ Actualizar permisos globalmente en AuthContext
            if (user) {
                const updatedUser = {
                    ...user,
                    permissions: user.permissions
                        .filter(p => !diff.remove.includes(systemPermissions.find(sp => sp.permissionName === p)?.systemPermissionId ?? -1))
                        .concat(
                            diff.add.map(id => systemPermissions.find(sp => sp.systemPermissionId === id)?.permissionName ?? "")
                        )
                        .filter(Boolean) // eliminar strings vacíos
                };
                setAuth(updatedUser);
            }

            router.push("/systemRoles");
            setStatusMsg(t("updatedSuccessfully"));
            onDone?.();
        } catch (error) {
            setErrorMsg(t("saveError"));
        }
    };

    if (!roleId) {
        return (
        <div className={layoutStyles.pageContainer}>
            <p>{t("invalidRole")}</p>
            <button onClick={() => router.push("/admin/systemRoles")}>{common("back")}</button>
        </div>
        );
    }

    const loading = loadingRoles || loadingPermissions || loadingAssigned;

    return (
        <div className={layoutStyles.pageContainer}>
        <h1>{t("title")}: {role?.roleName ?? roleId}</h1>

        {loading && <div className={layoutStyles.loading}>{t("loading")}</div>}

        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
        {/* {assignmentError && <p style={{ color: "red" }}>{String(assignmentError)}</p>} */}
        {statusMsg && <p style={{ color: "green" }}>{statusMsg}</p>}

        <div className={`${tableStyles.tableWrap} ${loading ? tableStyles.loading : ""}`}>
            <table className={tableStyles.table}>
                <thead>
                <tr className={tableStyles.rowHover}>
                    <th className={tableStyles.headCell}>{t("module")}</th>
                    <th className={tableStyles.headCell}>{t("permissions")}</th>
                </tr>
                </thead>
                <tbody>
                {Array.from(groupedPermissions.entries()).map(([moduleName, perms]) => (
                    <tr key={moduleName} className={tableStyles.rowHover}>
                    <td className={tableStyles.cell} style={{ fontWeight: 600 }}>{moduleName}</td>
                    <td className={tableStyles.cell}>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                        {perms.map((perm) => (
                            <label key={perm.systemPermissionId} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <input
                                type="checkbox"
                                checked={selectedIds.includes(perm.systemPermissionId)}
                                onChange={() => togglePermission(perm.systemPermissionId)}
                            />
                            {perm.actionName}
                            </label>
                        ))}
                        </div>
                    </td>
                    </tr>
                ))}
                {systemPermissions.length === 0 && (
                    <tr>
                    <td className={tableStyles.cell} colSpan={2}>
                        {t("noPermissions")}
                    </td>
                    </tr>
                )}
                </tbody>
            </table>
            </div>

        <div style={{ marginTop: 20, display: 'flex', gap: 8 }}>
            <Button
            type="button"
            variant="animated"
            onClick={onSave}
            disabled={!canSave || updating}
            loading={updating}
            loadingText={common("saving")}
            >
            {common("saveChanges")}
            </Button>

            <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/admin/systemRoles")}
            disabled={updating}
            >
            {common("cancel")}
            </Button>
        </div>
        </div>
    );
}