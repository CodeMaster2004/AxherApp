import axiosClient from "@/core/api/axiosClient";
import { Page, PaginationParams, ReportCategoryAiTranslationRequest, ReportCategoryAiTranslationResponse, ReportCategoryRequest, ReportCategoryResponse, ReportCategoryTranslationRequest, ReportCategoryTranslationResponse } from "@/entities/types";
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

        create: (
            categoryId: number,
            data: ReportCategoryTranslationRequest,
            config?: AxiosRequestConfig
        ) =>
            axiosClient.post<ReportCategoryTranslationResponse>(
                `/admin/report-categories/${categoryId}/translations`,
                data,
                config
            ),

        update: (
            categoryId: number,
            languageId: number,
            data: ReportCategoryTranslationRequest,
            config?: AxiosRequestConfig
        ) =>
            axiosClient.patch<ReportCategoryTranslationResponse>(
                `/admin/report-categories/${categoryId}/translations/${languageId}`,
                data,
                config
            ),

        translateWithAi: (
            categoryId: number,
            sourceLanguageId: number,
            data: ReportCategoryAiTranslationRequest,
            config?: AxiosRequestConfig
        ) =>
            axiosClient.post<ReportCategoryAiTranslationResponse>(
                `/admin/report-categories/${categoryId}/translations/${sourceLanguageId}/translate`,
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
