"use client";

import { ContentShelf, Page, ShelfTarget } from "@/entities/types";
import { shelfService } from "@/features/shelf/services/shelfService";
import { usePaginatedData } from "@/shared/hooks/usePaginatedData";
import { useMemo } from "react";

type UseShelfOptions = {
    initialData?: Page<ContentShelf>;
    target?: ShelfTarget;
}

export const useShelves = (options?: UseShelfOptions) => {

    const extraParams = useMemo(
        () => ({
            target: options?.target
        }),
        [options?.target]
    );

    const pagination = usePaginatedData<ContentShelf> (
        shelfService.getAll,
        {
            initialData: options?.initialData,
            initialSort: "contentShelfId,desc",
            initialSize: 10,
            extraParams
        }
    );

    return {

        shelves: pagination.data,
        loading: pagination.loading,

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
    };
}