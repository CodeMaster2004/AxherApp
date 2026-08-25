"use client";

import {Page, ReportCategoryResponse} from "@/entities/types";
import { reportCategoryService } from "@/features/ReportCategory/services/ReportCategoryService";
import { usePaginatedData } from "@/shared/hooks/usePaginatedData";

type UseReportCategoryOptions = {
    initialData?: Page<ReportCategoryResponse>;
};

export const useReportCategory = (
    options?: UseReportCategoryOptions
) => {

    const pagination =
        usePaginatedData<ReportCategoryResponse>(
            reportCategoryService.getAll,
            {
                initialData: options?.initialData,

                initialSort: "reportCategoryId,desc",

                initialSize: 10
            }
        );

    return {
        reportCategory: pagination.data,

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