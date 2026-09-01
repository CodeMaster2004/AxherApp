
import { adminShelfApi } from "@/core/api/endpoints/AdminShelfApi";
import {
    ContentShelfAiTranslationRequest,
    ContentShelfAiTranslationResponse,
    ContentShelfTranslationRequest,
    ContentShelfTranslationResponse,
} from "@/entities/types";


export const contentShelfTranslationService = {

    getAll: async (
        shelfId: number,
        signal?: AbortSignal
    ): Promise<ContentShelfTranslationResponse[]> => {

        const response =
            await adminShelfApi.translations.getAll(
                shelfId,
                { signal }
            );

        return response.data;
    },


    create: async (
        shelfId: number,
        data: ContentShelfTranslationRequest,
        signal?: AbortSignal
    ): Promise<ContentShelfTranslationResponse> => {
        const response = await adminShelfApi.translations.create(
            shelfId,
            data,
            { signal }
        );

        return response.data;
    },

    update: async (
        shelfId: number,
        languageId: number,
        data: ContentShelfTranslationRequest,
        signal?: AbortSignal
    ): Promise<ContentShelfTranslationResponse> => {
        const response = await adminShelfApi.translations.update(
            shelfId,
            languageId,
            data,
            { signal }
        );

        return response.data;
    },

    translateWithAi: async(
        shelfId: number,
        sourceLanguageId: number,
        data: ContentShelfAiTranslationRequest,
        signal?: AbortSignal
    ): Promise<ContentShelfAiTranslationResponse> => {
        const response = await adminShelfApi.translations.translateWithAi(
            shelfId,
            sourceLanguageId,
            data,
            { signal }
        );

        return response.data;
    },


    delete: async (
        shelfId: number,
        languageId: number,
        signal?: AbortSignal
    ): Promise<void> => {

        await adminShelfApi.translations.delete(
            shelfId,
            languageId,
            { signal }
        );
    },
};