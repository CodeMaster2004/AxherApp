"use client";

import { Page } from "@/entities/types";
import {
    SupportFaqFilters,
    SupportFaqResponse,
} from "@/entities/types/supportFaq.types";
import { supportFaqService } from "@/features/faqs/services/supportFaqService";
import { usePaginatedData } from "@/shared/hooks/usePaginatedData";
import { useCallback, useEffect, useState } from "react";

type Options = {
    initialData?: Page<SupportFaqResponse>;
    initialFilters?: SupportFaqFilters;
};

export const useSupportFaq = (options?: Options) => {

    const [filters, setFilters] =
        useState<SupportFaqFilters>(
            options?.initialFilters ?? {}
        );

    const fetchFaqs = useCallback(
        (
            params: Parameters<
                typeof supportFaqService.getAll
            >[0],
            search?: string,
            signal?: AbortSignal
        ) => {
            return supportFaqService.getAll(
                {
                    ...params,
                    ...filters,
                    search,
                }
            );
        },
        [filters]
    );

    const pagination =
        usePaginatedData<SupportFaqResponse>(
            fetchFaqs,
            {
                initialData: options?.initialData,
                initialSort: "displayOrder,asc",
                initialSize: 10,
            }
        );

    useEffect(() => {
        if (pagination.currentPage !== 0) {
            pagination.goToPage(0);
        }
    }, [
        filters,
        pagination.currentPage,
        pagination.goToPage,
    ]);

    return {
        faqs: pagination.data,

        loading: pagination.loading,
        error: pagination.error,

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

        sort: pagination.sort,
        setSort: pagination.setSort,

        filters,
        setFilters,

        refetch: pagination.refetch,
    };
};
