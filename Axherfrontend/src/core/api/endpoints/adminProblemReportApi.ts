import axiosClient from "@/core/api/axiosClient";
import { Page, PaginationParams } from "@/entities/types";
import { ProblemReportFilters, ProblemReportResponse, ProblemReportStatusRequest } from "@/entities/types/problemReport.types";
import { AxiosRequestConfig } from "axios";

export const adminProblemReportApi = {

    getAll: (
        params: PaginationParams & ProblemReportFilters,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.get<Page<ProblemReportResponse>>(
            "/admin/reports",
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
            `/admin/reports/${reportId}`,
            config
        ),

    updateStatus: (
        reportId: number,
        data: ProblemReportStatusRequest,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.patch<ProblemReportResponse>(
            `/admin/reports/${reportId}/status`,
            data,
            config
        ),

}