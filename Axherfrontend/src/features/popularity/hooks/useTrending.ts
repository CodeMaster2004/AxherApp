"use client";

import { ContentType, Page, PaginationParams, TrendingContent } from "@/entities/types";
import { popularityService } from "@/features/popularity/services/popularityService";
import { usePaginatedData } from "@/shared/hooks/usePaginatedData";
import { useCallback } from "react";

type useTrendingOptions = {
    initialData?: Page<TrendingContent>;
    type?: ContentType
}

export const useTrending = (options?: useTrendingOptions) => {


    const fetchTrending = useCallback(
        (
            params: PaginationParams,
            _search?: string,
            signal?: AbortSignal
        ) => {
            return popularityService.trending(
                params,
                options?.type,
                signal
            );
        },
        [options?.type]
    );

    const pagination = usePaginatedData<TrendingContent>(
        
    fetchTrending,

    {
        initialData: options?.initialData,
        initialSort:"trendingScore,desc",
        initialSize:10
    }
);

    return {
        trending: pagination.data,
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