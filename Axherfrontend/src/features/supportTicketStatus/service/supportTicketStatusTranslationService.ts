import { AdminSupportTicketStatusApi } from "@/core/api/endpoints/AdminSupportTicketStatusApi";
import { SupportTicketStatusTranslationRequest, SupportTicketStatusTranslationResponse } from "@/entities/types";

export const supportTicketStatusTranslationService = {

    getAll: async (
        statusId: number,
        signal?: AbortSignal
    ): Promise<SupportTicketStatusTranslationResponse[]> => {

        const response =
            await AdminSupportTicketStatusApi.translations.getAll(
                statusId,
                { signal }
            );

        return response.data;
    },


    save: async (
        statusId: number,
        data: SupportTicketStatusTranslationRequest,
        signal?: AbortSignal
    ): Promise<SupportTicketStatusTranslationResponse> => {

        const response =
            await AdminSupportTicketStatusApi.translations.save(
                statusId,
                data,
                { signal }
            );

        return response.data;
    },


    delete: async (
        statusId: number,
        languageId: number,
        signal?: AbortSignal
    ): Promise<void> => {

        await AdminSupportTicketStatusApi.translations.delete(
            statusId,
            languageId,
            { signal }
        );

    },

};