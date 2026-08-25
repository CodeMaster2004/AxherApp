
import { adminShelfApi } from "@/core/api/endpoints/AdminShelfApi";
import {
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


    save: async (
        shelfId: number,
        data: ContentShelfTranslationRequest,
        signal?: AbortSignal
    ): Promise<ContentShelfTranslationResponse> => {

        const response =
            await adminShelfApi.translations.save(
                shelfId,
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