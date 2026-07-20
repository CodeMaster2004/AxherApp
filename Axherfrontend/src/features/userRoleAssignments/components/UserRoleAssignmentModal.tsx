"use client";

import { SystemRoles, UserList } from "@/entities/types";
import Button from "@/shared/components/ui/Button";
import MultiSelect from "@/shared/components/ui/MultiSelect";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
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
            <h3>Gestionar roles de: {user.email}</h3>

            <MultiSelect
                label="Asignal roles"
                options={assignOptions}
                selected={selectedToAssing}
                onChange={setSelectedToAssing}
                placeholder="Agregar rol"
            />

            <MultiSelect
                label="Quitar roles"
                options={removeOptions}
                selected={selectedToRemove}
                onChange={setSelectedToRemove}
                placeholder="Quitar rol"
            />

            <div style={{ display: "flex", gap: 8 }}>
                <Button
                    variant="animated"
                    disabled={saving || selectedToAssing.length === 0}
                    loadingText="Asignando..."
                    onClick={() => onAssignRoles(user.userId, selectedToAssing.map(String))}
                >
                    Asignar
                </Button>

                <Button
                    variant="secondary"
                    disabled={removing || selectedToRemove.length === 0}
                    loadingText="Quitando..."
                    onClick={() => onRemoveRoles(user.userId, selectedToRemove.map(String))}
                >
                     Quitar
                </Button>

                <Button type="button" variant="secondary" onClick={onClose}>
                    Cerrar
                </Button>
            </div>
                {error && <p style={{ color: "red", marginTop: 10 }} role="alert">{error}</p>}
        </div>
    );
}