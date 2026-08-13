"use client";

import { Page, WatchlistResponse } from "@/entities/types";
import { watchlistService } from "@/features/watchlist/services/WatchlistService";
import { usePaginatedData } from "@/shared/hooks/usePaginatedData";

type UseWatchlistOptions = {
    initialData?: Page<WatchlistResponse>;
}

export const useWatchlist = (options?: UseWatchlistOptions) => {

    const pagination = usePaginatedData<WatchlistResponse>(
        watchlistService.getAll,
        {
            initialData: options?.initialData,
            initialSort: "addedAt,desc",
            initialSize: 10
        }
    );

    return {
        watchlist: pagination.data,

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
    };
}