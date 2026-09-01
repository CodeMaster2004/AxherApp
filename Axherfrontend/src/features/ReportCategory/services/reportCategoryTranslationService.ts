
import { AdminReportCategoryApi } from "@/core/api/endpoints/AdminReportCategoryApi";
import {
    ReportCategoryAiTranslationRequest,
    ReportCategoryAiTranslationResponse,
    ReportCategoryTranslationRequest,
    ReportCategoryTranslationResponse,
} from "@/entities/types";

export const reportCategoryTranslationService = {

    getAll: async (
        categoryId: number,
        signal?: AbortSignal
    ): Promise<ReportCategoryTranslationResponse[]> => {

        const response =
            await AdminReportCategoryApi.translations.getAll(
                categoryId,
                { signal }
            );

        return response.data;
    },

    create: async (
        categoryId: number,
        data: ReportCategoryTranslationRequest,
        signal?: AbortSignal
    ): Promise<ReportCategoryTranslationResponse> => {
        const response = await AdminReportCategoryApi.translations.create(
            categoryId,
            data,
            { signal }
        );

        return response.data;
    },

    update: async (
        categoryId: number,
        languageId: number,
        data: ReportCategoryTranslationRequest,
        signal?: AbortSignal
    ): Promise<ReportCategoryTranslationResponse> => {
        const response = await AdminReportCategoryApi.translations.update(
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
        data: ReportCategoryAiTranslationRequest,
        signal?: AbortSignal
    ): Promise<ReportCategoryAiTranslationResponse> => {
        const response = await AdminReportCategoryApi.translations.translateWithAi(
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

        await AdminReportCategoryApi.translations.delete(
            categoryId,
            languageId,
            { signal }
        );
    },

};