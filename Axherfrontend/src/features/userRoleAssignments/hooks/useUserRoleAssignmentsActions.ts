"use client";

import { userRoleAssignmentsService } from "@/features/userRoleAssignments/services/UserRoleAssignmentsService";
import { useCallback, useState } from "react";

type Options = {
    onSuccess?: (message?: string) => void;
    onError?: (error: unknown) => void;
}

export const useUserRoleAssignmentsActions = (options?: Options) => {
    const [saving, setSaving] = useState(false);
    const [removing, setRemoving] = useState(false);
    const [error, setError] = useState<unknown | null>(null);

    const assignRoles = useCallback(
        async (userId: number, roles: string[]) => {
            setSaving(true);
            setError(null);
            try {
                const message = await userRoleAssignmentsService.assignRoles(userId, { roles });
                options?.onSuccess?.(message);
                return message;
            }catch(err) {
                setError(err);
                options?.onError?.(err);
                throw err;
            }finally{
                setSaving(false);
            }
        },
        [options]
    );

    const removeRoles = useCallback(
        async (userId: number, roles: string[]) => {
            setRemoving(true);
            setError(null);
            try {
                const message = await userRoleAssignmentsService.removeRoles(userId, { roles });
                options?.onSuccess?.(message);
                return message;
            }catch(err) {
                setError(err);
                options?.onError?.(err);
                throw err;
            }finally{
                setRemoving(false);
            }
        },
        [options]
    );

    return {
        assignRoles,
        removeRoles,
        saving,
        removing,
        error,
    };
}