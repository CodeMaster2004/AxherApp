import axiosClient from "@/core/api/axiosClient";
import { Page, PaginationParams } from "@/entities/types";
import { ProblemReportRequest, ProblemReportResponse } from "@/entities/types/problemReport.types";
import { AxiosRequestConfig } from "axios";

export const ProblemReportApi = {

    getAll: (
        params: PaginationParams,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.get<Page<ProblemReportResponse>>(
            "/reports",
            {
                params,
                ...config
            }
        ),

    getById: (
        reportId: number,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.get<ProblemReportResponse>(
            `/reports/${reportId}`,
            config
        ),

    create: (
        data: ProblemReportRequest,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.post<ProblemReportResponse>(
            "/reports",
            data,
            config
        ),

    delete: (
        reportId: number,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.delete<void>(
            `/reports/${reportId}`,
            config
        )
}