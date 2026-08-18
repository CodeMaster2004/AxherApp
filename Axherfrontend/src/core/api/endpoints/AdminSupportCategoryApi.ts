import axiosClient from "@/core/api/axiosClient";
import { Page, PaginationParams, SupportCategoryRequest, SupportCategoryResponse } from "@/entities/types";
import { AxiosRequestConfig } from "axios";

export const AdminSupportCategoryApi = {

    getAll: (
        params: PaginationParams,
        search?: string,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.get<Page<SupportCategoryResponse>>(
            "/admin/support/ticket-category",
            {
                params: {
                    ...params,
                    search
                },
                ...config
            }
        ),

    getById: (
        supportCategoryId: number,
        config?: AxiosRequestConfig
    )=>
        axiosClient.get<SupportCategoryResponse>(
            `/admin/support/ticket-category/${supportCategoryId}`,
            config
        ),

    create: (
        data: SupportCategoryRequest,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.post<SupportCategoryResponse>(
            "/admin/support/ticket-category",
            data,
            config
        ),

    update: (
        supportCategoryId: number,
        data: SupportCategoryRequest,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.patch<SupportCategoryResponse>(
            `/admin/support/ticket-category/${supportCategoryId}`,
            data,
            config
        ),
    
    delete: (
        supportCategoryId: number,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.delete(
            `/admin/support/ticket-category/${supportCategoryId}`,
            config
        )
}