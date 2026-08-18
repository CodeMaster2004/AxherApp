import { supportMessageApi } from "@/core/api/endpoints/SupportMessageApi";
import { SupportMessageRequest, SupportMessageResponse } from "@/entities/types";

export const supportMessageService = {

    getAllByTicketId: async (
        ticketId: number,
        signal?: AbortSignal
    ): Promise<SupportMessageResponse[]> => {

        const response = await supportMessageApi.getAllByTicketId(
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

        const response = await supportMessageApi.sendMessage(
            ticketId,
            data,
            { signal }
        );

        return response.data;
    },
}