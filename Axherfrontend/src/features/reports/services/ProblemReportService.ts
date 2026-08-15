import { ProblemReportApi } from "@/core/api/endpoints/ProblemReportApi";
import { Page, PaginationParams } from "@/entities/types";
import { ProblemReportRequest, ProblemReportResponse } from "@/entities/types/problemReport.types";

export const problemReportService = {

    getAll: async (
        params: PaginationParams,
        signal?: AbortSignal
    ): Promise<Page<ProblemReportResponse>> => {
        const response = await ProblemReportApi.getAll(
            params,
            { signal }
        );

        return response.data;
    },

    getById: async (
        reportId: number,
        signal?: AbortSignal
    ): Promise<ProblemReportResponse> => {
        const response = await ProblemReportApi.getById(
            reportId,
            { signal }
        );

        return response.data;
    },

    create: async (
        data: ProblemReportRequest,
        signal?: AbortSignal
    ): Promise<ProblemReportResponse> => {
        const response = await ProblemReportApi.create(
            data,
            { signal }
        );

        return response.data;
    },

    delete: async (
        reportId: number,
        signal?: AbortSignal
    ): Promise<void> => {
        await ProblemReportApi.delete(
            reportId,
            { signal }
        );
    },

};