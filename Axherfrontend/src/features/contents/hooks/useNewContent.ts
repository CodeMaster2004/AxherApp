"use client";

import { ContentDetail, ContentType, Page, PaginationParams } from "@/entities/types";
import { contentService } from "@/features/contents/services/ContentService";
import { usePaginatedData } from "@/shared/hooks/usePaginatedData";
import { useCallback } from "react";

type UseNewContentOptions = {
    initialData?: Page<ContentDetail>;
    type?: ContentType;
}

export const useNewContent = (options?: UseNewContentOptions) => {

    const fetchNewContent = useCallback (
        (
            params: PaginationParams,
            _search?: string,
            signal?: AbortSignal
        ) => {
            return contentService.getNewContent(
                {
                    ...params,
                    type: options?.type
                },
                signal 
            );
        },
        [options?.type]
    );

    const pagination = usePaginatedData<ContentDetail>(
        fetchNewContent,
        {
            initialData: options?.initialData,
            initialSort: "releaseDate,desc",
            initialSize: 10
        }
    )

    return {
        newContent: pagination.data,
        loading: pagination.loading,

        currentPage: pagination.currentPage,
        totalPages: pagination.totalPages,

        nextPage: pagination.nextPage,
        prevPage: pagination.prevPage,
        
        goToPage: pagination.goToPage,
        refetch: pagination.refetch,
    }
}