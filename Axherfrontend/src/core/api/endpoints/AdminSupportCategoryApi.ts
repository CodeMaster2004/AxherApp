import axiosClient from "@/core/api/axiosClient";
import { Page, PaginationParams, SupportCategoryRequest, SupportCategoryResponse, SupportCategoryTranslationRequest, SupportCategoryTranslationResponse } from "@/entities/types";
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
        ),

    translations: {

        getAll: (
            categoryId: number,
            config?: AxiosRequestConfig
        ) =>
            axiosClient.get<
                SupportCategoryTranslationResponse[]
            >(
                `/admin/support-categories/${categoryId}/translations`,
                config
            ),

        save: (
            categoryId: number,
            data: SupportCategoryTranslationRequest,
            config?: AxiosRequestConfig
        ) =>
            axiosClient.patch<
                SupportCategoryTranslationResponse
            >(
                `/admin/support-categories/${categoryId}/translations`,
                data,
                config
            ),

        delete: (
            categoryId: number,
            languageId: number,
            config?: AxiosRequestConfig
        ) =>
            axiosClient.delete(
                `/admin/support-categories/${categoryId}/translations/${languageId}`,
                config
            ),
    },
        
}