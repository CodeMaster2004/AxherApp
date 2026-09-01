import { AdminSupportTicketStatusApi } from "@/core/api/endpoints/AdminSupportTicketStatusApi";
import { SupportTicketStatusAiTranslationRequest, SupportTicketStatusAiTranslationResponse, SupportTicketStatusTranslationRequest, SupportTicketStatusTranslationResponse } from "@/entities/types";

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


    create: async (
        statusId: number,
        data: SupportTicketStatusTranslationRequest,
        signal?: AbortSignal
    ): Promise<SupportTicketStatusTranslationResponse> => {
        const response =
            await AdminSupportTicketStatusApi.translations.create(
                statusId,
                data,
                { signal }
            );

        return response.data;
    },

    update: async (
        statusId: number,
        languageId: number,
        data: SupportTicketStatusTranslationRequest,
        signal?: AbortSignal
    ): Promise<SupportTicketStatusTranslationResponse> => {
        const response =
            await AdminSupportTicketStatusApi.translations.update(
                statusId,
                languageId,
                data,
                { signal }
            );

        return response.data;
    },

    translateWithAi: async(
        statusId: number,
        sourceLanguageId: number,
        data: SupportTicketStatusAiTranslationRequest,
        signal?: AbortSignal
    ): Promise<SupportTicketStatusAiTranslationResponse> => {

        const response =
            await AdminSupportTicketStatusApi.translations.translateWithAi(
                statusId,
                sourceLanguageId,
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