"use client";

import { ContentDetail, ContentFilters, ContentQueryParams, Page } from "@/entities/types";
import { contentCatalogService } from "@/features/contents/services/ContentCatalogService";
import { usePaginatedData } from "@/shared/hooks/usePaginatedData";
import { useCallback } from "react";

type UseCatalogContentsOptions = {
    initialData?: Page<ContentDetail>;
    filters?: ContentFilters;
}

export const useCatalogContents = (options?: UseCatalogContentsOptions) => {

    const fetchContents = useCallback(

        (
            params: ContentQueryParams,
            _search?: string,
            signal?: AbortSignal
        ) => {
            return contentCatalogService.getAll(
                {
                    ...params,
                    ...options?.filters,
                },
                signal
            );
        },
        [options?.filters]
    );

    const pagination = usePaginatedData<ContentDetail>(

        fetchContents,
        {
            initialData: options?.initialData,
            initialSort: "releaseDate,desc",
            initialSize: 10
        }
    );

    return {

        contents: pagination.data,
        loading: pagination.loading,

        currentPage: pagination.currentPage,
        totalPages: pagination.totalPages,

        nextPage: pagination.nextPage,
        prevPage: pagination.prevPage,
        goToPage: pagination.goToPage,

        refetch: pagination.refetch,
    }


}