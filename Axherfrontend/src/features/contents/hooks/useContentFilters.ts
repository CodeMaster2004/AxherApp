"use client";

import { ContentFiltersDto, ContentType } from "@/entities/types";
import { contentCatalogService } from "@/features/contents/services/ContentCatalogService";
import { useEffect, useState } from "react";

export const useContentFilters = (type?: ContentType) => {

    const [filters, setFilters] = useState<ContentFiltersDto>({
        categories: [],
        years: []
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();

        const loadFilters = async () => {

            try{
                setLoading(true);
                const data = await contentCatalogService.getFilters(type, controller.signal);
                setFilters(data);

            } catch (error) {
                if (error instanceof Error) {
                    return;
                }
                console.error("Error loading filters", error);
            
            } finally {
                setLoading(false);
            }
        };

        loadFilters();

        return () => {
            controller.abort();
        }
    }, [type])

    return {
        filters,
        loading
    }
}