import { AdminSupportCategoryApi } from "@/core/api/endpoints/AdminSupportCategoryApi";

import {
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

    save: async (
        categoryId: number,
        data: SupportCategoryTranslationRequest,
        signal?: AbortSignal
    ): Promise<SupportCategoryTranslationResponse> => {

        const response =
            await AdminSupportCategoryApi.translations.save(
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

        await AdminSupportCategoryApi.translations.delete(
            categoryId,
            languageId,
            { signal }
        );
    },
};