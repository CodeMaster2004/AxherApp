import { adminSupportFaqApi } from "@/core/api/endpoints/adminSupportFaqApi";
import {
    SupportFaqAiTranslationRequest,
    SupportFaqAiTranslationResponse,
    SupportFaqTranslationRequest,
    SupportFaqTranslationResponse,
} from "@/entities/types/supportFaq.types";

export const supportFaqTranslationService = {

    getAll: async (
        faqId: number,
        signal?: AbortSignal
    ): Promise<SupportFaqTranslationResponse[]> => {

        const response =
            await adminSupportFaqApi.translations.getAll(
                faqId,
                { signal }
            );

        return response.data;
    },

    create: async (
        faqId: number,
        data: SupportFaqTranslationRequest,
        signal?: AbortSignal
    ): Promise<SupportFaqTranslationResponse> => {

        const response =
            await adminSupportFaqApi.translations.create(
                faqId,
                data,
                { signal }
            );

        return response.data;
    },

    update: async (
        faqId: number,
        languageId: number,
        data: SupportFaqTranslationRequest,
        signal?: AbortSignal
    ): Promise<SupportFaqTranslationResponse> => {
        
        const response =
            await adminSupportFaqApi.translations.update(
                faqId,
                languageId,
                data,
                { signal }
            );

        return response.data;
    },

    translateWithAi: async(
        faqId: number,
        sourceLanguageId: number,
        data: SupportFaqAiTranslationRequest,
        signal?: AbortSignal
    ): Promise<SupportFaqAiTranslationResponse> => {
        const response = await adminSupportFaqApi.translations.translateWithAi(
            faqId,
            sourceLanguageId,
            data,
            { signal }
        );
        
        return response.data;
    },

    delete: async (
        faqId: number,
        languageId: number,
        signal?: AbortSignal
    ): Promise<void> => {

        await adminSupportFaqApi.translations.delete(
            faqId,
            languageId,
            { signal }
        );
    },
};