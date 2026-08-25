
import { AdminReportCategoryApi } from "@/core/api/endpoints/AdminReportCategoryApi";
import {
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

    save: async (
        categoryId: number,
        data: ReportCategoryTranslationRequest,
        signal?: AbortSignal
    ): Promise<ReportCategoryTranslationResponse> => {

        const response =
            await AdminReportCategoryApi.translations.save(
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

        await AdminReportCategoryApi.translations.delete(
            categoryId,
            languageId,
            { signal }
        );
    },

};