
import { contentCategoriesApi } from "@/core/api/endpoints/ContentCategoriesApi";
import {
    ContentCategoryAiTranslationRequest,
    ContentCategoryAiTranslationResponse,
    ContentCategoryTranslationRequest,
    ContentCategoryTranslationResponse,
} from "@/entities/types";

export const contentCategoryTranslationService = {

    getAll: async (
        categoryId: number,
        signal?: AbortSignal
    ): Promise<ContentCategoryTranslationResponse[]> => {

        const response =
            await contentCategoriesApi.translations.getAll(
                categoryId,
                { signal }
            );

        return response.data;
    },

    create: async (
        categoryId: number,
        data: ContentCategoryTranslationRequest,
        signal?: AbortSignal
    ): Promise<ContentCategoryTranslationResponse> => {
        const response =
            await contentCategoriesApi.translations.create(
                categoryId,
                data,
                { signal }
            );

        return response.data;
    },

    update: async (
        categoryId: number,
        languageId: number,
        data: ContentCategoryTranslationRequest,
        signal?: AbortSignal
    ): Promise<ContentCategoryTranslationResponse> => {
        const response =
            await contentCategoriesApi.translations.update(
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
        data: ContentCategoryAiTranslationRequest,
        signal?: AbortSignal
    ): Promise<ContentCategoryAiTranslationResponse> => {
        const response =
            await contentCategoriesApi.translations.translateWithAi(
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

        await contentCategoriesApi.translations.delete(
            categoryId,
            languageId,
            { signal }
        );
    },
};