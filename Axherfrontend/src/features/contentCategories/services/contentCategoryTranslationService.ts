
import { contentCategoriesApi } from "@/core/api/endpoints/ContentCategoriesApi";
import {
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

    save: async (
        categoryId: number,
        data: ContentCategoryTranslationRequest,
        signal?: AbortSignal
    ): Promise<ContentCategoryTranslationResponse> => {

        const response =
            await contentCategoriesApi.translations.save(
                categoryId,
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