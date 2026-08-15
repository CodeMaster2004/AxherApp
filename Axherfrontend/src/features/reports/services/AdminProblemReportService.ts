import { adminProblemReportApi } from "@/core/api/endpoints/adminProblemReportApi";
import { Page, PaginationParams } from "@/entities/types";
import {
    ProblemReportFilters,
    ProblemReportResponse,
    ProblemReportStatusRequest
} from "@/entities/types/problemReport.types";

export const adminProblemReportService = {

    getAll: async (
        params: PaginationParams & ProblemReportFilters,
        signal?: AbortSignal
    ): Promise<Page<ProblemReportResponse>> => {
        const response = await adminProblemReportApi.getAll(
            params,
            { signal }
        );

        return response.data;
    },

    getById: async (
        reportId: number,
        signal?: AbortSignal
    ): Promise<ProblemReportResponse> => {
        const response = await adminProblemReportApi.getById(
            reportId,
            { signal }
        );

        return response.data;
    },

    updateStatus: async (
        reportId: number,
        data: ProblemReportStatusRequest,
        signal?: AbortSignal
    ): Promise<ProblemReportResponse> => {
        const response = await adminProblemReportApi.updateStatus(
            reportId,
            data,
            { signal }
        );

        return response.data;
    },

};