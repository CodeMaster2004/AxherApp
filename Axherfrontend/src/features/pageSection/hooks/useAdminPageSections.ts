"use client";

import { PageSection, PageType } from "@/entities/types/pageSection.types";
import { pageSectionService } from "@/features/pageSection/services/pageSectionService";
import { useCallback, useEffect, useState } from "react";

export const useAdminPageSections = (page: PageType) => {

    const [sections, setSections] = useState<PageSection[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<unknown>(null);

    const load = useCallback(
        async (signal?: AbortSignal) => {

            try {

                setLoading(true);
                setError(null);

                const data =
                    await pageSectionService.getAllByPage(
                        page,
                        signal
                    );

                setSections(data);

            } catch (error) {

                if (
                    error instanceof DOMException &&
                    error.name === "AbortError"
                ) {
                    return;
                }

                setError(error);
                console.error(error);

            } finally {

                setLoading(false);

            }

        },
        [page]
    );

    useEffect(() => {

        const controller = new AbortController();

        load(controller.signal);

        return () =>
            controller.abort();

    }, [load]);

    const refetch = useCallback(() => {
        return load();
    }, [load]);

    return {
        sections,
        loading,
        error,
        refetch
    };
};