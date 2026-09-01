import { AdminSupportCategoryApi } from "@/core/api/endpoints/AdminSupportCategoryApi";

import {
    SupportCategoryAiTranslationRequest,
    SupportCategoryAiTranslationResponse,
    SupportCategoryTranslationRequest,
    SupportCategoryTranslationResponse,
} from "@/entities/types";

export const supportCategoryTranslationService = {

    getAll: async (
        categoryId: number,
        signal?: AbortSignal
    ): Promise<SupportCategoryTranslationResponse[]> => {

        const response =
            await AdminSupportCategoryApi.translations.getAll(
                categoryId,
                { signal }
            );

        return response.data;
    },

    create: async (
        categoryId: number,
        data: SupportCategoryTranslationRequest,
        signal?: AbortSignal
    ): Promise<SupportCategoryTranslationResponse> => {
        const response = await AdminSupportCategoryApi.translations.create(
            categoryId,
            data,
            { signal }
        );

        return response.data;
    },

    update: async (
        categoryId: number,
        languageId: number,
        data: SupportCategoryTranslationRequest,
        signal?: AbortSignal
    ): Promise<SupportCategoryTranslationResponse> => {
        const response = await AdminSupportCategoryApi.translations.update(
            categoryId,
            languageId,
            data,
            { signal }
        );

        return response.data;
    },

    translateWithAi: async(
        categoryId: number,
        sourceLanguageId: number,
        data: SupportCategoryAiTranslationRequest,
        signal?: AbortSignal
    ): Promise<SupportCategoryAiTranslationResponse> => {
        const response = await AdminSupportCategoryApi.translations.translateWithAi(
            categoryId,
            sourceLanguageId,
            data,
            { signal }
        );

        return response.data;
    },

    delete: async (
        categoryId: number,
        languageId: number,
        signal?: AbortSignal
    ): Promise<void> => {

        await AdminSupportCategoryApi.translations.delete(
            categoryId,
            languageId,
            { signal }
        );
    },
};