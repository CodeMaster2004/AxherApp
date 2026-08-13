"use client";

import { Page, SearchHistoryResponse } from "@/entities/types";
import { searchHistoryService } from "@/features/search/service/SearchHistoryService";
import { usePaginatedData } from "@/shared/hooks/usePaginatedData";

type UseSearchHistoryOptions = {
    initialData?: Page<SearchHistoryResponse>;
}

export const useSearchHistory = (options?: UseSearchHistoryOptions) => {

    const pagination = usePaginatedData<SearchHistoryResponse>(
        searchHistoryService.getHistory,
        {
            initialData: options?.initialData,
            initialSort: "searchedAt,desc",
            initialSize: 10
        }
    );

    return {
        searchHistory: pagination.data,

        loading: pagination.loading,

        currentPage: pagination.currentPage,
        totalPages: pagination.totalPages,
        totalElements: pagination.totalElements,

        nextPage: pagination.nextPage,
        prevPage: pagination.prevPage,
        goToPage: pagination.goToPage,

        isFirstPage: pagination.isFirstPage,
        isLastPage: pagination.isLastPage,

        refetch: pagination.refetch,
    }
}