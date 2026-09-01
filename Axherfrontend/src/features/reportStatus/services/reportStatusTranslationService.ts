
import { AdminReportStatusApi } from "@/core/api/endpoints/AdminReportStatusApi";
import {
    ReportStatusAiTranslationRequest,
    ReportStatusAiTranslationResponse,
    ReportStatusTranslationRequest,
    ReportStatusTranslationResponse,
} from "@/entities/types/reportStatus.types";

export const reportStatusTranslationService = {

    getAll: async (
        statusId: number,
        signal?: AbortSignal
    ): Promise<ReportStatusTranslationResponse[]> => {

        const response =
            await AdminReportStatusApi.translations.getAll(
                statusId,
                { signal }
            );

        return response.data;
    },

    create: async (
        statusId: number,
        data: ReportStatusTranslationRequest,
        signal?: AbortSignal
    ): Promise<ReportStatusTranslationResponse> => {
        const response = await AdminReportStatusApi.translations.create(
            statusId,
            data,
            { signal }
        );

        return response.data;
    },

    update: async (
        statusId: number,
        languageId: number,
        data: ReportStatusTranslationRequest,
        signal?: AbortSignal
    ): Promise<ReportStatusTranslationResponse> => {
        const response = await AdminReportStatusApi.translations.update(
            statusId,
            languageId,
            data,
            { signal }
        );

        return response.data;
    },

    translateWithAi: async(
        statusId: number,
        sourceLanguageId: number,
        data: ReportStatusAiTranslationRequest,
        signal?: AbortSignal
    ): Promise<ReportStatusAiTranslationResponse> => {
        const response = await AdminReportStatusApi.translations.translateWithAi(
            statusId,
            sourceLanguageId,
            data,
            { signal }
        );
        return response.data;
    },

    delete: async (
        statusId: number,
        languageId: number,
        signal?: AbortSignal
    ): Promise<void> => {

        await AdminReportStatusApi.translations.delete(
            statusId,
            languageId,
            { signal }
        );
    },
};