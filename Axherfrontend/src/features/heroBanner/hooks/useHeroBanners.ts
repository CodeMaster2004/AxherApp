"use client";

import { HeroBanner, Page } from "@/entities/types";
import { heroBannerService } from "@/features/heroBanner/services/heroBannerService";
import { usePaginatedData } from '@/shared/hooks/usePaginatedData';

type Options = {
    initialData?: Page<HeroBanner>;
};

export const useHeroBanners = (options?: Options) => {

    const pagination = usePaginatedData<HeroBanner>(
        heroBannerService.getAll,
        {
            initialData: options?.initialData,
            initialSort: "priority,asc",
            initialSize: 10,
        }
    )

    return {
        heroBanners: pagination.data,
        loading: pagination.loading,
        error: pagination.error,
        currentPage: pagination.currentPage,
        totalPages: pagination.totalPages,
        nextPage: pagination.nextPage,
        prevPage: pagination.prevPage,
        goToPage: pagination.goToPage,
        isFirstPage: pagination.isFirstPage,
        isLastPage: pagination.isLastPage,
        searchTerm: pagination.searchTerm,
        setSearchTerm: pagination.setSearchTerm,
        refetch: pagination.refetch,
    }
}