import axiosClient from "@/core/api/axiosClient";
import {
    LanguageRequest,
    LanguageResponse,
    Page,
    PaginationParams
} from "@/entities/types";
import { AxiosRequestConfig } from "axios";

export const AdminLanguageApi = {

    getAll: (
        params: PaginationParams,
        search?: string,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.get<Page<LanguageResponse>>(
            "/admin/languages",
            {
                params: {
                    ...params,
                    search
                },
                ...config
            }
        ),

    getById: (
        languageId: number,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.get<LanguageResponse>(
            `/admin/languages/${languageId}`,
            config
        ),

    create: (
        data: LanguageRequest,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.post<LanguageResponse>(
            "/admin/languages",
            data,
            config
        ),

    update: (
        languageId: number,
        data: LanguageRequest,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.patch<LanguageResponse>(
            `/admin/languages/${languageId}`,
            data,
            config
        ),

    delete: (
        languageId: number,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.delete(
            `/admin/languages/${languageId}`,
            config
        )
};