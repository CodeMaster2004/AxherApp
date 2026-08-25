import { contentStatusApi } from "@/core/api/endpoints/ContentStatusApi";
import { ContentStatusTranslationRequest, ContentStatusTranslationResponse } from "@/entities/types/status.types";

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

    save: async (
        statusId: number,
        data: ContentStatusTranslationRequest,
        signal?: AbortSignal
    ): Promise<ContentStatusTranslationResponse> => {

        const res =
            await contentStatusApi.translations.save(
                statusId,
                data,
                { signal }
            );

        return res.data;
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
