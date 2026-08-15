
"use client";

import { Page } from "@/entities/types";
import { ProblemReportResponse } from "@/entities/types/problemReport.types";
import { problemReportService } from "@/features/reports/services/ProblemReportService";
import { usePaginatedData } from "@/shared/hooks/usePaginatedData";
import { useCallback } from "react";

type UseProblemReportsOptions = {
    initialData?: Page<ProblemReportResponse>;
};

export const useProblemReports = (
    options?: UseProblemReportsOptions
) => {

    const fetchReports = useCallback(
        (
            params: Parameters<typeof problemReportService.getAll>[0],
            _search?: string,
            signal?: AbortSignal
        ) => {
            return problemReportService.getAll(params, signal);
        },
        []
    );

    const pagination = usePaginatedData<ProblemReportResponse>(
        fetchReports,
        {
            initialData: options?.initialData,
            initialSort: "reportId,desc",
            initialSize: 10,
        }
    );

    return {
        reports: pagination.data,
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
};

