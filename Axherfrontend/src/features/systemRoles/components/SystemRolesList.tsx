import { SystemRoles } from "@/entities/types";
import Pagination from "@/shared/components/ui/Pagination";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import tableStyles from "@/shared/styles/shared/Table.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ConfirmDialog from "../../../shared/components/ui/ConfirmDialog";
import MoreMenu from "../../../shared/components/ui/MoreMenu";
import { useTranslations } from "next-intl";

interface Props{
    systemRoles: SystemRoles[];
    onDelete: (id: number) => void;
    onEdit: (systemRoles: SystemRoles) => void;
    deletingId?: number | null;
    loading?: boolean;

    currentPage: number;
    totalPages: number;
    onNextPage: () => void;
    onPrevPage: () => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;
}

export default function SystemRolesList ({
    systemRoles,
    onDelete,
    onEdit,
    deletingId,
    loading,
    currentPage,
    totalPages,
    onNextPage,
    onPrevPage,
    searchTerm,
    onSearchChange
}: Props) {

    const common = useTranslations("common");
    const t = useTranslations("systemRoles");

    const router = useRouter();
    const [confirmDialog , setConfirmDialog] = useState<{isOpen: boolean; id: number; systemRoles: string}>({
        isOpen: false,
        id: 0,
        systemRoles: "",
    });

    const handleDeleteClick = (id: number, systemRoles: string) => {
        setConfirmDialog({isOpen: true, id, systemRoles})
    };
    const handleConfirmDelete = () => {
        onDelete(confirmDialog.id);
        setConfirmDialog({isOpen: false, id: 0, systemRoles: ""})
    };
    const handleCancelDelete = () => {
        setConfirmDialog({isOpen: false, id: 0, systemRoles: ""})
    }

    return(
        <div className={layoutStyles.section}>
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title={t("delete.title")}
                message={t("delete.message", {roleName: confirmDialog.systemRoles})}
                confirmText={common("delete")}
                cancelText={common("cancel")}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                variant="danger"
            />

            <div className={tableStyles.searchBox}>
                <input
                    type="text"
                    placeholder={t("list.searchPlaceholder")}
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className={tableStyles.searchInput}
                />
            </div>

            {systemRoles.length === 0 ? (
                <p>{loading ? common("loading") : t("list.empty")}</p>
            ) : (
                <div className={`${tableStyles.tableWrap} ${loading ? tableStyles.loading : ""}`}>
                    <table className={tableStyles.table}>
                        <thead>
                            <tr className={tableStyles.rowHover}>
                                <th className={`${tableStyles.headCell} ${tableStyles.idColumn}`}>ID</th>
                                <th className={tableStyles.headCell}>Rol del Sistema</th>
                                <th className={tableStyles.headCell}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {systemRoles.map((role) => (
                                <tr key={role.systemRoleId} className={tableStyles.rowHover}>
                                    <td className={`${tableStyles.cell} ${tableStyles.idColumn}`}>{role.systemRoleId}</td>
                                    <td className={tableStyles.cell}>{role.roleName}</td>
                                    <td className={`${tableStyles.cell} ${tableStyles.actions}`}>
                                        <MoreMenu
                                            items={[
                                                {
                                                    label: t("list.permissions"),
                                                    onClick: () => router.push(`/admin/systemRoles/${role.systemRoleId}/permissions`),
                                                },
                                                {
                                                    label: common("edit"),
                                                    onClick: () => onEdit(role),
                                                },
                                                {
                                                    label:
                                                        deletingId === role.systemRoleId
                                                            ? common("deleting")
                                                            : common("delete"),
                                                    onClick: () => handleDeleteClick(role.systemRoleId, role.roleName),
                                                    variant: "danger",
                                                },
                                            ]}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {systemRoles.length > 0 && totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onNextPage={onNextPage}
                    onPrevPage={onPrevPage}
                />
            )}

        </div>
    )
}