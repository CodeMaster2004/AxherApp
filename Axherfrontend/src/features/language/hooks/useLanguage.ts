"use client";

import { Page, LanguageResponse } from "@/entities/types";
import { languageService } from "@/features/language/services/languageService";
import { usePaginatedData } from "@/shared/hooks/usePaginatedData";

type UseLanguageOptions = {
    initialData?: Page<LanguageResponse>;
};

export const useLanguage = (options?: UseLanguageOptions) => {

    const pagination = usePaginatedData<LanguageResponse>(
        languageService.getAll,
        {
            initialData: options?.initialData,
            initialSort: "languageId,desc",
            initialSize: 10
        }
    );

    return {
        languages: pagination.data,
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
    };
};