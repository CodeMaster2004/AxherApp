import { supportTicketApi } from "@/core/api/endpoints/SupportTicketApi";
import { Page, PaginationParams, SupportTicketRequest, SupportTicketResponse } from "@/entities/types";

export const supportTicketService = {

    getAll: async (
        params: PaginationParams,
        signal?: AbortSignal
    ): Promise<Page<SupportTicketResponse>> => {

        const response = await supportTicketApi.getAll(
            params,
            { signal }
        );

        return response.data;
    },

    getById: async (
        ticketId: number,
        signal?: AbortSignal
    ): Promise<SupportTicketResponse> => {

        const response = await supportTicketApi.getById(
            ticketId,
            { signal }
        );

        return response.data;
    },

    create: async (
        data: SupportTicketRequest,
        signal?: AbortSignal
    ): Promise<SupportTicketResponse> => {

        const response = await supportTicketApi.create(
            data,
            { signal }
        );

        return response.data;
    },
}