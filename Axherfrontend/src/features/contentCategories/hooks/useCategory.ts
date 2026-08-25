"use client";

import { ContentCategoryResponse } from "@/entities/types";
import { contentCategoriesService } from "@/features/contentCategories/services/ContentCategoriesService";
import { useEffect, useState } from "react";

export const useCategory = (slug: string) => {

    const [category, setCategory] = useState<ContentCategoryResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();

        const loadCategory = async () => {

            try {
                const data = await contentCategoriesService.getBySlug(slug, controller.signal);
                setCategory(data);
            } catch (error) {
                console.error("Error loading category:", error);
            }finally{
                setLoading(false);
            }
        };
        loadCategory();

        return () => {
            controller.abort();
        }
    }, [slug]);

    return { category, loading };
}