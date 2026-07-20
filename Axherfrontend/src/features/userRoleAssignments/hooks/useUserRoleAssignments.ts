"use client";

import { SystemRoles } from "@/entities/types";
import { userRoleAssignmentsService } from "@/features/userRoleAssignments/services/UserRoleAssignmentsService";
import { useCallback, useEffect, useState } from "react";

export const useUserRoleAssignments = (userId?: number) => {
    const [roles, setRoles] = useState<SystemRoles[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<unknown | null>(null);

    const fetchRoles = useCallback(async (signal?: AbortSignal) => {
        if (!userId) {
            setRoles([]);
            setError(null);
            setLoading(false);
            return [] as SystemRoles[];
        }

        setLoading(true);
        setError(null);
        try {
            const data = await userRoleAssignmentsService.getById(userId, signal);
            setRoles(data);
            return data;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
         console.log("useUserRoleAssignments: userId", userId, "loading", loading);
        if (!userId) return;
        const controller = new AbortController();
        fetchRoles(controller.signal).catch(() => undefined);
        return () => controller.abort();
    }, [fetchRoles, userId, loading]);

    const refetch = useCallback(() => fetchRoles(), [fetchRoles]);

    return {
        roles,
        loading,
        error,
        refetch,
    }
}