import axiosClient from "@/core/api/axiosClient";
import { Page, PaginationParams, ReportStatusRequest, ReportStatusResponse, ReportStatusTranslationRequest, ReportStatusTranslationResponse } from "@/entities/types";
import { AxiosRequestConfig } from "axios";

export const AdminReportStatusApi = {

    getAll: (
        params: PaginationParams,
        search?: string,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.get<Page<ReportStatusResponse>>(
            "/admin/report-status",
            {
                params: {
                    ...params,
                    search
                },
                ...config
            }
        ),

    getById: (
        reportStatusId: number,
        config?: AxiosRequestConfig
    )=>
        axiosClient.get<ReportStatusResponse>(
            `/admin/report-status/${reportStatusId}`,
            config
        ),

    create: (
        data: ReportStatusRequest,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.post<ReportStatusResponse>(
            "/admin/report-status",
            data,
            config
        ),

    update: (
        reportStatusId: number,
        data: ReportStatusRequest,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.patch<ReportStatusResponse>(
            `/admin/report-status/${reportStatusId}`,
            data,
            config
        ),
    
    delete: (
        reportStatusId: number,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.delete(
            `/admin/report-status/${reportStatusId}`,
            config
        ),

    translations : {
        getAll: (
        statusId: number,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.get<ReportStatusTranslationResponse[]>(
            `/admin/report-statuses/${statusId}/translations`,
            config
        ),

    save: (
        statusId: number,
        data: ReportStatusTranslationRequest,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.patch<ReportStatusTranslationResponse>(
            `/admin/report-statuses/${statusId}/translations`,
            data,
            config
        ),

    delete: (
        statusId: number,
        languageId: number,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.delete(
            `/admin/report-statuses/${statusId}/translations/${languageId}`,
            config
        ),
    }
}