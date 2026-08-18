"use client";

import { Page, SupportTicketStatusResponse } from "@/entities/types";
import { supportTicketStatusService } from "@/features/supportTicketStatus/service/SupportTicketStatusService";
import { usePaginatedData } from "@/shared/hooks/usePaginatedData";

type UseSupportTicketStatusOptions = {
    initialData?: Page<SupportTicketStatusResponse>;
}

export const useSupportTicketStatus = (options?: UseSupportTicketStatusOptions) => {

    const pagination = usePaginatedData<SupportTicketStatusResponse>(

        supportTicketStatusService.getAll,
        {
            initialData: options?.initialData,
            initialSort: "supportTicketStatusId,desc",
            initialSize: 10
        }
    )

    return {
        supportTicketStatus: pagination.data,
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