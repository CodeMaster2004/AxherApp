"use client";

import { Page } from "@/entities/types";
import {
    ProblemReportFilters,
    ProblemReportResponse,
} from "@/entities/types/problemReport.types";
import { adminProblemReportService } from "@/features/reports/services/AdminProblemReportService";
import { usePaginatedData } from "@/shared/hooks/usePaginatedData";
import { useCallback, useEffect, useState } from "react";

type UseAdminProblemReportsOptions = {
    initialData?: Page<ProblemReportResponse>;
};

export const useAdminProblemReports = (
    options?: UseAdminProblemReportsOptions
) => {

    const [filters, setFilters] = useState<ProblemReportFilters>({});

    const fetchReports = useCallback(
        (
            params: Parameters<typeof adminProblemReportService.getAll>[0],
            _search?: string,
            signal?: AbortSignal
        ) => {
            return adminProblemReportService.getAll(
                {
                    ...params,
                    ...filters,
                },
                signal
            );
        },
        [filters]
    );

    const pagination = usePaginatedData<ProblemReportResponse>(
        fetchReports,
        {
            initialData: options?.initialData,
            initialSort: "reportId,desc",
            initialSize: 10,
        }
    );

    useEffect(() => {
        if (pagination.currentPage !== 0) {
            pagination.goToPage(0);
        }
    }, [filters, pagination.currentPage, pagination.goToPage]);

    return {
        reports: pagination.data,

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