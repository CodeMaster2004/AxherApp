"use client";

import { PageSection, PageType } from "@/entities/types/pageSection.types";
import { pageSectionService } from "@/features/pageSection/services/pageSectionService";
import axios from "axios";
import { useEffect, useState } from "react";

export const usePageSections = (page: PageType) => {
    
    const[sections, setSections] = useState<PageSection[]>([]);
    const[loading, setLoading] = useState(true);
    const[error, setError] = useState<unknown>(null);
    
    useEffect(() => {

        const controller = new AbortController();

        const load = async () => {

            try {
                setLoading(true);
                setError(null);

                const data = await pageSectionService.getByPage(
                    page,
                    controller.signal
                );

                setSections(data);
            } catch (error) {
                if (axios.isCancel(error)) {
                    return;
                }

                setError(error);
                console.error(
                    "Error cargando PageSections:",
                    error
                );

            } finally {
                setLoading(false);
            }
        };
        load();
        return () => controller.abort();
    }, [page]);

    return {
        sections,
        loading,
        error
    }
}