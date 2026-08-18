import { adminSupportMessageApi } from "@/core/api/endpoints/AdminSupportMessageApi";
import { SupportMessageRequest, SupportMessageResponse } from "@/entities/types";

export const adminSupportMessageService = {

    getAllByTicketId: async (
        ticketId: number,
        signal?: AbortSignal
    ): Promise<SupportMessageResponse[]> => {

        const response = await adminSupportMessageApi.getAllByTicketId(
            ticketId,
            { signal }
        );

        return response.data;
    },

    sendMessage: async (
        ticketId: number,
        data: SupportMessageRequest,
        signal?: AbortSignal
    ): Promise<SupportMessageResponse> => {

        const response = await adminSupportMessageApi.sendMessage(
            ticketId,
            data,
            { signal }
        );

        return response.data;
    },
}