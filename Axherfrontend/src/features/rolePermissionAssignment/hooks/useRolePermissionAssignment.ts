"use client";

import { AssignPermissionsRequest } from "@/entities/types";
import { rolePermissionAssignmentService } from "@/features/rolePermissionAssignment/services/RolePermissionAssignment";
import { useCallback, useState } from "react";

type Options = {
    onSuccess?: (result?: string | string[]) => void;
    onError?: (error: unknown) => void;
};

export const useRolePermissionAssignment = (options?: Options) => {
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState<unknown | null>(null);

    const getPermissionsByRole = useCallback(
        async (roleId: number, signal?: AbortSignal) => {
            setLoading(true);
            setError(null);
            try {
                const permissions = await rolePermissionAssignmentService.getByRole(roleId, signal);
                options?.onSuccess?.(permissions);
                return permissions;
            } catch (err) {
                setError(err);
                options?.onError?.(err);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [options]
    );

    const updatePermissionsByRole = useCallback(
        async (roleId: number, payload: AssignPermissionsRequest, signal?: AbortSignal) => {
            setUpdating(true);
            setError(null);
            try {
                const result = await rolePermissionAssignmentService.updateByRole(roleId, payload, signal);
                options?.onSuccess?.(result);
                return result;
            } catch (err) {
                setError(err);
                options?.onError?.(err);
                throw err;
            } finally {
                setUpdating(false);
            }
        },
        [options]
    );

    return {
        loading,
        updating,
        error,
        getPermissionsByRole,
        updatePermissionsByRole,
    };
};
