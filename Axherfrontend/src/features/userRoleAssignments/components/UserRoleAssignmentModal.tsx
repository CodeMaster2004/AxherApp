"use client";

import { SystemRoles, UserList } from "@/entities/types";
import Button from "@/shared/components/ui/Button";
import MultiSelect from "@/shared/components/ui/MultiSelect";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

interface Props {
    isOpen: boolean;
    loading: boolean;
    user: UserList | null;
    allRoles: SystemRoles[];
    userCurrentRoles: string[];
    saving?: boolean;
    removing?: boolean;
    onAssignRoles: (userId: number, roles: string[]) => Promise<unknown> | void;
    onRemoveRoles: (userId: number, roles: string[]) => Promise<unknown> | void;
    onClose: () => void;
    error?: string;
}

export default function UserRoleAssignmentModal({
    isOpen,
    user,
    allRoles,
    loading,
    userCurrentRoles,
    saving,
    removing,
    onAssignRoles,
    onRemoveRoles,
    onClose,
    error,
} : Props ) {
    const [selectedToAssing, setSelectedToAssing] = useState<Array<string | number>>([]);
    const [selectedToRemove, setSelectedToRemove] = useState<Array<string | number>>([]);
    const t = useTranslations("userRoleAssignment");
    useEffect(() => {
        if(isOpen) {
            setSelectedToAssing([])
            setSelectedToRemove([])
        }
    }, [isOpen, user?.userId]);

    const assignOptions = useMemo (
        () =>
            allRoles
                .map((r) => ({ value: r.roleName, label: r.roleName}))
                .filter((r) => !userCurrentRoles.includes(String(r.value))),
            [allRoles, userCurrentRoles]
    );

    const removeOptions = useMemo(
        () => userCurrentRoles.map((r) => ({ value: r, label: r})),
        [userCurrentRoles]
    );

    if(!isOpen || !user) return null;
    

    return (
        <div className={layoutStyles.section}>
            <h3>{t("title", { email: user.email })}</h3>

            <MultiSelect
                label={t("assign.label")}
                options={assignOptions}
                selected={selectedToAssing}
                onChange={setSelectedToAssing}
                placeholder={t("assign.placeholder")}
            />

            <MultiSelect
                label={t("removes.label")}
                options={removeOptions}
                selected={selectedToRemove}
                onChange={setSelectedToRemove}
                placeholder={t("removes.placeholder")}
            />

            <div style={{ display: "flex", gap: 8 }}>
                <Button
                    variant="animated"
                    disabled={saving || selectedToAssing.length === 0}
                    loadingText={t("assign.loading")}
                    onClick={() => onAssignRoles(user.userId, selectedToAssing.map(String))}
                >
                    {t("assign.button")}
                </Button>

                <Button
                    variant="secondary"
                    disabled={removing || selectedToRemove.length === 0}
                    loadingText={t("removes.loading")}
                    onClick={() => onRemoveRoles(user.userId, selectedToRemove.map(String))}
                >
                     {t("removes.button")}
                </Button>

                <Button type="button" variant="secondary" onClick={onClose}>
                    {t("clos")}
                </Button>
            </div>
                {error && <p style={{ color: "red", marginTop: 10 }} role="alert">{error}</p>}
        </div>
    );
}