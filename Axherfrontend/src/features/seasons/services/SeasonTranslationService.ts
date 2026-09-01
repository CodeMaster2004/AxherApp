import { adminSeasonsApi } from "@/core/api/endpoints/AdminSeasonsApi";
import { SeasonAiTranslationRequest, SeasonAiTranslationResponse, SeasonTranslation, SeasonTranslationRequest } from "@/entities/types";

export const seasonTranslationService = {

    getTranslations: async (
        seasonId: number,
        signal?: AbortSignal
    ): Promise<SeasonTranslation[]> => {

        const res = await adminSeasonsApi.translations.getTranslations(
            seasonId,
            { signal }
        );

        return res.data;
    },

    createTranslation: async (
        seasonId: number,
        data: SeasonTranslationRequest,
        signal?: AbortSignal
    ): Promise<SeasonTranslation> => {

        const res = await adminSeasonsApi.translations.create(
            seasonId,
            data,
            { signal }
        );

        return res.data;
    },

    updateTranslation: async (
        seasonId: number,
        languageId: number,
        data: SeasonTranslationRequest,
        signal?: AbortSignal
    ): Promise<SeasonTranslation> => {

        const res = await adminSeasonsApi.translations.update(
            seasonId,
            languageId,
            data,
            { signal }
        );

        return res.data;
    },

    translateWithAi: async(
        seasonId: number,
        sourceLanguageId: number,
        data: SeasonAiTranslationRequest,
        signal?: AbortSignal
    ): Promise<SeasonAiTranslationResponse> => {

        const res = await adminSeasonsApi.translations.translateWithAi(
            seasonId,
            sourceLanguageId,
            data,
            { signal }
        );

        return res.data;
    },

    deleteTranslation: async (
        seasonId: number,
        languageId: number,
        signal?: AbortSignal
    ): Promise<void> => {

        await adminSeasonsApi.translations.deleteTranslation(
            seasonId,
            languageId,
            { signal }
        );
    },
}