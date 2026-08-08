"use client";

import { ContentDetail, Page, SearchParams } from "@/entities/types";
import { contentService } from "@/features/contents/services/ContentService";
import { usePaginatedData } from "@/shared/hooks/usePaginatedData";
import { useCallback } from "react";

type useGlobalSearchInit = {
    
    initialData?: Page<ContentDetail>
}

function emptyPage<T>(): Page<T> {
    return {
        content: [],

        pageable: {
            pageNumber: 0,
            pageSize: 12,
            sort: {
                sorted: false,
                unsorted: true,
                empty: true
            },
            offset: 0,
            paged: true,
            unpaged: false
        },

        totalElements: 0,
        totalPages: 0,

        last: true,
        first: true,

        size: 12,
        number: 0,
        numberOfElements: 0,

        empty: true
    };
}

export function useGlobalSearch( query: string, initialData?: useGlobalSearchInit){

    const fetchFn = useCallback(

        (
            params: SearchParams,
            search?: string,
            signal?: AbortSignal
        )=> {

            if(!query.trim()) {
                return Promise.resolve(
                    emptyPage<ContentDetail>()
                );
            }

            return contentService.searchGlobal(
                {
                    ...params,
                    q: query
                },
                signal
            );
        },
        [query]
    );

    const pagination = usePaginatedData<ContentDetail>(fetchFn, {

        initialData: initialData?.initialData,
        initialSort: "contentId,desc",
        initialSize: 12,
    });

    return {

        results: pagination.data,

        loading: pagination.loading,
        error: pagination.error,

        currentPage: pagination.currentPage,
        pageSize: pagination.pageSize,

        totalPages: pagination.totalPages,
        totalElements: pagination.totalElements,

        nextPage: pagination.nextPage,
        prevPage: pagination.prevPage,
        goToPage: pagination.goToPage,
        refetch: pagination.refetch,

        searchTerm: query,
    }
}