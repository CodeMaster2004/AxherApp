"use cleint";

import { Page, SupportTicketFilters, SupportTicketResponse } from "@/entities/types";
import { adminSupportTicketService } from "@/features/supportTicket/service/AdminSupportTicketService";
import { usePaginatedData } from "@/shared/hooks/usePaginatedData";
import { useCallback, useEffect, useState } from "react";

type UseAdminSupportTicketsOptions = {
    initialData?: Page<SupportTicketResponse>;
};

export const useAdminSupportTickets = (
    options?: UseAdminSupportTicketsOptions
) => {

    const [filters, setFilters] = useState<SupportTicketFilters>({});

    const fetchTickets = useCallback(
        (
            params: Parameters<
                typeof adminSupportTicketService.getAll
            >[0],
            _search?: string,
            signal?: AbortSignal
        ) => {
            return adminSupportTicketService.getAll(
                {
                    ...params,
                    ...filters,
                },
                signal
            );
        },
        [filters]
    );

    const pagination = usePaginatedData<SupportTicketResponse>(
        fetchTickets,
        {
            initialData: options?.initialData,
            initialSort: "createdAt,desc",
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
        pagination.goToPage
    ]);

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

        searchTerm: pagination.searchTerm,
        setSearchTerm: pagination.setSearchTerm,

        sort: pagination.sort,
        setSort: pagination.setSort,

        filters,
        setFilters,

        refetch: pagination.refetch,
    };
};