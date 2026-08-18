"use client";

import { Page, SupportCategoryResponse } from "@/entities/types";
import { supportCategoryService } from "@/features/supportCategory/services/SupportCategoryService";
import { usePaginatedData } from "@/shared/hooks/usePaginatedData";

type UseSupportCategoryOptions = {
    initialData?: Page<SupportCategoryResponse>;
}

export const useSupportCategory = (options?: UseSupportCategoryOptions) => {

    const pagination = usePaginatedData<SupportCategoryResponse>(

        supportCategoryService.getAll,
        {
            initialData: options?.initialData,
            initialSort: "supportCategoryId,desc",
            initialSize: 10
        }
    )

    return {
        supportCategory: pagination.data,
        loading: pagination.loading,

        currentPage: pagination.currentPage,
        totalPages: pagination.totalPages,
        totalElements: pagination.totalElements,

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