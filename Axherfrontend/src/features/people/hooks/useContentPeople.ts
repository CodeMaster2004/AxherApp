"use client";

import { ContentPersonRoleResponse } from "@/entities/types";
import { contentPersonRoleService } from "@/features/people/services/contentPersonRoleService";
import { useCallback, useEffect, useState } from "react";

interface Props {
    contentId: number;
}

export function useContentPeople({
    contentId,
}: Props) {
    const [contentPersonRoles, setContentPersonRoles] =
        useState<ContentPersonRoleResponse[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<unknown | null>(null);

    const fetchContentPersonRoles = useCallback(
        async (signal?: AbortSignal) => {
            setLoading(true);
            setError(null);

            try {
                const data =
                    await contentPersonRoleService.getByContent(
                        contentId,
                        signal
                    );

                if (!signal?.aborted) {
                    setContentPersonRoles(data);
                }
            } catch (err) {
                if (signal?.aborted) {
                    return;
                }

                setError(err);
            } finally {
                if (!signal?.aborted) {
                    setLoading(false);
                }
            }
        },
        [contentId]
    );

    useEffect(() => {
        const controller = new AbortController();

        fetchContentPersonRoles(controller.signal);

        return () => {
            controller.abort();
        };
    }, [fetchContentPersonRoles]);

    const refetch = useCallback(() => {
        return fetchContentPersonRoles();
    }, [fetchContentPersonRoles]);

    return {
        contentPersonRoles,
        loading,
        error,
        refetch,
    };
}