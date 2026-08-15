"use client";

import { Page, ReportStatusResponse } from "@/entities/types";
import { reportStatusService } from "@/features/reportStatus/services/ReportStatusService";
import { usePaginatedData } from "@/shared/hooks/usePaginatedData";

type UseReportStatusOptions = {
    initialData?: Page<ReportStatusResponse>;
}

export const useReportStatus = (options?: UseReportStatusOptions) => {

    const pagination = usePaginatedData<ReportStatusResponse>(

        reportStatusService.getAll,
        {
            initialData: options?.initialData,
            initialSort: "reportStatusId,desc",
            initialSize: 10
        }
    )

    return {
        reportStatus: pagination.data,
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
    }
}