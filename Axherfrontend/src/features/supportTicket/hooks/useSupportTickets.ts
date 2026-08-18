"use client";

import { Page, SupportTicketResponse } from "@/entities/types";
import { supportTicketService } from "@/features/supportTicket/service/SupportTicketService";
import { usePaginatedData } from "@/shared/hooks/usePaginatedData";
import { useCallback } from "react";

type UseSupportTicketsOptions = {
    initialData?: Page<SupportTicketResponse>;
};

export const useSupportTickets = (
    options?: UseSupportTicketsOptions
) => {

    const fetchTickets = useCallback(
        (
            params: Parameters<typeof supportTicketService.getAll>[0],
            _search?: string,
            signal?: AbortSignal
        ) => {
            return supportTicketService.getAll(
                params,
                signal
            );
        },
        []
    );

    const pagination = usePaginatedData<SupportTicketResponse>(
        fetchTickets,
        {
            initialData: options?.initialData,
            initialSort: "createdAt,desc",
            initialSize: 10,
        }
    );

    return {
        tickets: pagination.data,

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

        refetch: pagination.refetch,
    };
};