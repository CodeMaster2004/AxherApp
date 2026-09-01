import { AdminEpisodesApi } from "@/core/api/endpoints/AdminEpisodesApi";
import { EpisodeAiTranslationRequest, EpisodeAiTranslationResponse, EpisodeTranslation, EpisodeTranslationRequest } from "@/entities/types";

export const episodeTranslationService = {

    getTranslations: async (
        episodeId: number,
        signal?: AbortSignal
    ): Promise<EpisodeTranslation[]> => {

        const res = await AdminEpisodesApi.translations.getTranslations(
            episodeId,
            { signal }
        );

        return res.data;
    },

    create: async (
        episodeId: number,
        data: EpisodeTranslationRequest,
        signal?: AbortSignal
    ): Promise<EpisodeTranslation> => {
        const response =
            await AdminEpisodesApi.translations.create(
                episodeId,
                data,
                { signal }
            );

        return response.data;
    },

    update: async (
        episodeId: number,
        languageId: number,
        data: EpisodeTranslationRequest,
        signal?: AbortSignal
    ): Promise<EpisodeTranslation> => {
        const response =
            await AdminEpisodesApi.translations.update(
                episodeId,
                languageId,
                data,
                { signal }
            );

        return response.data;
    },

    translateWithAi: async(
        episodeId: number,
        sourceLanguageId: number,
        data: EpisodeAiTranslationRequest,
        signal?: AbortSignal
    ): Promise<EpisodeAiTranslationResponse> => {
        const response = await AdminEpisodesApi.translations.translateWithAi(
            episodeId,
            sourceLanguageId,
            data,
            { signal }
        );
        
        return response.data;
    },

    deleteTranslation: async (
        episodeId: number,
        languageId: number,
        signal?: AbortSignal
    ): Promise<void> => {

        await AdminEpisodesApi.translations.deleteTranslation(
            episodeId,
            languageId,
            { signal }
        );
    },
}