import { AdminReportCategoryApi } from "@/core/api/endpoints/AdminReportCategoryApi";

import {
    Page,
    PaginationParams,
    ReportCategoryRequest,
    ReportCategoryResponse
} from "@/entities/types";

export const reportCategoryService = {

    getAll: async (
        params: PaginationParams,
        search?: string,
        signal?: AbortSignal
    ): Promise<Page<ReportCategoryResponse>> => {

        const response =
            await AdminReportCategoryApi.getAll(
                params,
                search,
                { signal }
            );

        return response.data;
    },

    getById: async (
        reportCategoryId: number,
        signal?: AbortSignal
    ): Promise<ReportCategoryResponse> => {

        const response =
            await AdminReportCategoryApi.getById(
                reportCategoryId,
                { signal }
            );

        return response.data;
    },

    create: async (
        data: ReportCategoryRequest,
        signal?: AbortSignal
    ): Promise<ReportCategoryResponse> => {

        const response =
            await AdminReportCategoryApi.create(
                data,
                { signal }
            );

        return response.data;
    },

    update: async (
        reportCategoryId: number,
        data: ReportCategoryRequest,
        signal?: AbortSignal
    ): Promise<ReportCategoryResponse> => {

        const response =
            await AdminReportCategoryApi.update(
                reportCategoryId,
                data,
                { signal }
            );

        return response.data;
    },

    delete: async (
        reportCategoryId: number,
        signal?: AbortSignal
    ): Promise<void> => {

        await AdminReportCategoryApi.delete(
            reportCategoryId,
            { signal }
        );
    }

};
