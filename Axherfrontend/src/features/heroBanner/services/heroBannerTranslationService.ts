import { adminHeroBannerApi } from "@/core/api/endpoints/AdminHeroBannerApi";
import {
    HeroBannerTranslationRequest,
    HeroBannerTranslationResponse,
} from "@/entities/types";

export const heroBannerTranslationService = {

    getAll: async (
        heroBannerId: number,
        signal?: AbortSignal
    ): Promise<HeroBannerTranslationResponse[]> => {

        const response =
            await adminHeroBannerApi.translations.getAll(
                heroBannerId,
                { signal }
            );

        return response.data;
    },


    save: async (
        heroBannerId: number,
        data: HeroBannerTranslationRequest,
        signal?: AbortSignal
    ): Promise<HeroBannerTranslationResponse> => {

        const response =
            await adminHeroBannerApi.translations.save(
                heroBannerId,
                data,
                { signal }
            );

        return response.data;
    },


    delete: async (
        heroBannerId: number,
        languageId: number,
        signal?: AbortSignal
    ): Promise<void> => {

        await adminHeroBannerApi.translations.delete(
            heroBannerId,
            languageId,
            { signal }
        );
    },

};