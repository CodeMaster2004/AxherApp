import { adminSupportTicketApi } from "@/core/api/endpoints/AdminSupportTicketApi";
import { Page, PaginationParams, SupportTicketFilters, SupportTicketResponse, TicketStatusRequest } from "@/entities/types";

export const adminSupportTicketService = {

    getAll: async (
        params: PaginationParams & SupportTicketFilters,
        signal?: AbortSignal
    ): Promise<Page<SupportTicketResponse>> => {

        const response = await adminSupportTicketApi.getAll(
            params,
            { signal }
        );

        return response.data;
    },

    getById: async (
        ticketId: number,
        signal?: AbortSignal
    ): Promise<SupportTicketResponse> => {

        const response = await adminSupportTicketApi.getById(
            ticketId,
            { signal }
        );

        return response.data;
    },

    updateStatus: async (
        ticketId: number,
        data: TicketStatusRequest,
        signal?: AbortSignal
    ): Promise<SupportTicketResponse> => {

        const response = await adminSupportTicketApi.updateStatus(
            ticketId,
            data,
            { signal }
        );

        return response.data;
    },
}