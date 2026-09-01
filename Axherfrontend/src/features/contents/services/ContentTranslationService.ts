import { contentApi } from "@/core/api/endpoints/AdminContentApi";
import { ContentAiTranslationRequest, ContentAiTranslationResponse, ContentTranslation, ContentTranslationRequest } from "@/entities/types";

export const contentTranslationService = {

    getTranslations: async(
        contentId: number,
        signal?: AbortSignal
    ): Promise<ContentTranslation[]> => {
        const res = await contentApi.translations.getTranslations(contentId, { signal });
        return res.data;
    },

    create: async (
        contentId: number,
        data: ContentTranslationRequest,
        signal?: AbortSignal
    ): Promise<ContentTranslation> => {
        const response =
            await contentApi.translations.create(
                contentId,
                data,
                { signal }
            );

        return response.data;
    },

    update: async (
        contentId: number,
        languageId: number,
        data: ContentTranslationRequest,
        signal?: AbortSignal
    ): Promise<ContentTranslation> => {
        const response =
            await contentApi.translations.update(
                contentId,
                languageId,
                data,
                { signal }
            );

        return response.data;
    },

    translateWithAi: async(
        contentId: number,
        sourceLanguageId: number,
        data: ContentAiTranslationRequest,
        signal?: AbortSignal
    ): Promise<ContentAiTranslationResponse> => {
        const response = await contentApi.translations.translateWithAi(
            contentId,
            sourceLanguageId,
            data,
            { signal }
        );
        
        return response.data;
    },
    
    deleteTranslation: async(
        contentId: number,
        languageId: number,
        signal?: AbortSignal
    ): Promise<void> => {
        await contentApi.translations.deleteTranslation(contentId, languageId, { signal });
    }
}