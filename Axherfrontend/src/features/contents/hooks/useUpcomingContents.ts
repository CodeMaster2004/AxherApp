"use client";

import { Page, PaginationParams, UpcomingContent } from "@/entities/types";
import { contentService } from "@/features/contents/services/ContentService";
import { usePaginatedData } from "@/shared/hooks/usePaginatedData";
import { useCallback } from "react";

type UseUpcomingContentsOptions = {
    initialData?: Page<UpcomingContent>
};

export const useUpcomingContents = (
    options?: UseUpcomingContentsOptions
) => {

    const fetchUpcoming = useCallback(
    (
        params: PaginationParams,
        _search?: string,
        signal?: AbortSignal
    ) => {
        return contentService.getUpcoming(params, signal);
    },
    []
);


const pagination = usePaginatedData<UpcomingContent>(
    fetchUpcoming,
        {
            initialData: options?.initialData,
            initialSort: "releaseDate,asc",
            initialSize: 10,
        }
    )

    return {
        upcomingContents: pagination.data,
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