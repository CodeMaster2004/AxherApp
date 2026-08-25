import { AxiosRequestConfig } from "axios";
import axiosClient from "../axiosClient";
import { Page, PaginationParams } from "@/entities/types";
import { ContentStatusRequest, ContentStatusResponse, ContentStatusTranslationRequest, ContentStatusTranslationResponse } from "@/entities/types/status.types";

export const contentStatusApi = {
   getAll: (params: PaginationParams, search?: string, config?: AxiosRequestConfig) =>
        axiosClient.get<Page<ContentStatusResponse>>("/content-status", {
            params: {...params, search},
            ...config
        }),

    getById: (id: number, config?: AxiosRequestConfig) => 
        axiosClient.get<ContentStatusResponse>(`/content-status/${id}`, config),

    create: (
        data: ContentStatusRequest,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.post<ContentStatusResponse>(
            "/content-status",
            data,
            config
        ),

    update: (
        id: number,
        data: Partial<ContentStatusRequest>,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.patch<ContentStatusResponse>(
            `/content-status/${id}`,
            data,
            config
        ),

    delete: (id: number, config?: AxiosRequestConfig) => axiosClient.delete(`/content-status/${id}`, config),

    translations: {

        getAll: (
            statusId: number,
            config?: AxiosRequestConfig
        ) =>
            axiosClient.get<ContentStatusTranslationResponse[]>(
                `/admin/content-statuses/${statusId}/translations`,
                config
            ),

        save: (
            statusId: number,
            data: ContentStatusTranslationRequest,
            config?: AxiosRequestConfig
        ) =>
            axiosClient.patch<ContentStatusTranslationResponse>(
                `/admin/content-statuses/${statusId}/translations`,
                data,
                config
            ),

        delete: (
            statusId: number,
            languageId: number,
            config?: AxiosRequestConfig
        ) =>
            axiosClient.delete(
                `/admin/content-statuses/${statusId}/translations/${languageId}`,
                config
            ),
    },
}
