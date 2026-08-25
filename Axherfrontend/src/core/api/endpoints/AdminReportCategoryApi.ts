import axiosClient from "@/core/api/axiosClient";
import { Page, PaginationParams, ReportCategoryRequest, ReportCategoryResponse, ReportCategoryTranslationRequest, ReportCategoryTranslationResponse } from "@/entities/types";
import { AxiosRequestConfig } from "axios";

export const AdminReportCategoryApi = {

    getAll: (
        params: PaginationParams,
        search?: string,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.get<Page<ReportCategoryResponse>>(
            "/admin/report-category",
            {
                params: {
                    ...params,
                    search
                },
                ...config
            }
        ),

    getById: (
        reportCategoryId: number,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.get<ReportCategoryResponse>(
            `/admin/report-category/${reportCategoryId}`,
            config
        ),

    create: (
        data: ReportCategoryRequest,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.post<ReportCategoryResponse>(
            "/admin/report-category",
            data,
            config
        ),

    update: (
        reportCategoryId: number,
        data: ReportCategoryRequest,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.patch<ReportCategoryResponse>(
            `/admin/report-category/${reportCategoryId}`,
            data,
            config
        ),

    delete: (
        reportCategoryId: number,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.delete(
            `/admin/report-category/${reportCategoryId}`,
            config
        ),

    translations: {
        getAll: (
            categoryId: number,
            config?: AxiosRequestConfig
        ) =>
            axiosClient.get<ReportCategoryTranslationResponse[]>(
                `/admin/report-categories/${categoryId}/translations`,
                config
            ),

        save: (
            categoryId: number,
            data: ReportCategoryTranslationRequest,
            config?: AxiosRequestConfig
        ) =>
            axiosClient.patch<ReportCategoryTranslationResponse>(
                `/admin/report-categories/${categoryId}/translations`,
                data,
                config
            ),

        delete: (
            categoryId: number,
            languageId: number,
            config?: AxiosRequestConfig
        ) =>
            axiosClient.delete(
                `/admin/report-categories/${categoryId}/translations/${languageId}`,
                config
            ),
    },
};
