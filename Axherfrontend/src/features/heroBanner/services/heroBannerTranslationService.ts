import { adminHeroBannerApi } from "@/core/api/endpoints/AdminHeroBannerApi";
import {
    HeroBannerAiTranslationRequest,
    HeroBannerAiTranslationResponse,
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


    create: async (
        heroBannerId: number,
        data: HeroBannerTranslationRequest,
        signal?: AbortSignal
    ): Promise<HeroBannerTranslationResponse> => {
        const response = await adminHeroBannerApi.translations.create(
            heroBannerId,
            data,
            { signal }
        );

        return response.data;
    },

    update: async (
        heroBannerId: number,
        languageId: number,
        data: HeroBannerTranslationRequest,
        signal?: AbortSignal
    ): Promise<HeroBannerTranslationResponse> => {
        const response = await adminHeroBannerApi.translations.update(
            heroBannerId,
            languageId,
            data,
            { signal }
        );

        return response.data;
    },

    translateWithAi: async(
        heroBannerId: number,
        sourceLanguageId: number,
        data: HeroBannerAiTranslationRequest,
        signal?: AbortSignal
    ): Promise<HeroBannerAiTranslationResponse> => {
        const response = await adminHeroBannerApi.translations.translateWithAi(
            heroBannerId,
            sourceLanguageId,
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