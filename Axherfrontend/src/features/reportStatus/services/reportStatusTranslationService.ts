
import { AdminReportStatusApi } from "@/core/api/endpoints/AdminReportStatusApi";
import {
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

    save: async (
        statusId: number,
        data: ReportStatusTranslationRequest,
        signal?: AbortSignal
    ): Promise<ReportStatusTranslationResponse> => {

        const response =
            await AdminReportStatusApi.translations.save(
                statusId,
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