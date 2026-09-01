import { contentStatusApi } from "@/core/api/endpoints/ContentStatusApi";
import { ContentStatusAiTranslationRequest, ContentStatusAiTranslationResponse, ContentStatusTranslationRequest, ContentStatusTranslationResponse } from "@/entities/types/status.types";

export const contentStatusTranslationService = {

    getAll: async (
        statusId: number,
        signal?: AbortSignal
    ): Promise<ContentStatusTranslationResponse[]> => {

        const res =
            await contentStatusApi.translations.getAll(
                statusId,
                { signal }
            );

        return res.data;
    },

    create: async (
        statusId: number,
        data: ContentStatusTranslationRequest,
        signal?: AbortSignal
    ): Promise<ContentStatusTranslationResponse> => {
        const response =
            await contentStatusApi.translations.create(
                statusId,
                data,
                { signal }
            );

        return response.data;
    },

    update: async (
        statusId: number,
        languageId: number,
        data: ContentStatusTranslationRequest,
        signal?: AbortSignal
    ): Promise<ContentStatusTranslationResponse> => {
        const response =
            await contentStatusApi.translations.update(
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
        data: ContentStatusAiTranslationRequest,
        signal?: AbortSignal
    ): Promise<ContentStatusAiTranslationResponse> => {
        const response = await contentStatusApi.translations.translateWithAi(
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

        await contentStatusApi.translations.delete(
            statusId,
            languageId,
            { signal }
        );
    },
};
