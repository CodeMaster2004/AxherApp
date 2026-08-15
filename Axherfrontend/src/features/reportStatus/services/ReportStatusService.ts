import { AdminReportStatusApi } from "@/core/api/endpoints/AdminReportStatusApi";
import { Page, PaginationParams, ReportStatusRequest, ReportStatusResponse } from "@/entities/types";

export const reportStatusService = {

    getAll: async (
        params: PaginationParams,
        search?: string,
        signal?: AbortSignal
    ): Promise<Page<ReportStatusResponse>> => {
        const response = await AdminReportStatusApi.getAll(params, search, { signal });
        return response.data;
    },

    getById: async (
        reportStatusId: number,
        signal?: AbortSignal

    ): Promise<ReportStatusResponse> => {
        const response = await AdminReportStatusApi.getById(reportStatusId, { signal });
        return response.data;
    },

    create: async (
        data: ReportStatusRequest,
        signal?: AbortSignal
    ): Promise<ReportStatusResponse> => {
        const response = await AdminReportStatusApi.create(data, { signal });
        return response.data;
    },

    update: async (
        reportStatusId: number,
        data: ReportStatusRequest,
        signal?: AbortSignal
    ): Promise<ReportStatusResponse> => {
        const response = await AdminReportStatusApi.update(reportStatusId, data, { signal });
        return response.data;
    },

    delete: async (
        reportStatusId: number,
        signal?: AbortSignal
    ): Promise<void> => {
        await AdminReportStatusApi.delete(reportStatusId, { signal });
    }
    
    
}