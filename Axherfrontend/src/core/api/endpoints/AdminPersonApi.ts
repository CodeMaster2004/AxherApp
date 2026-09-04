import axiosClient from "@/core/api/axiosClient";
import { Page, PaginationParams, PersonResponse } from "@/entities/types";
import { AxiosRequestConfig } from "axios";

export const AdminPersonApi = {

    getAll: (
        params: PaginationParams,
        search?: string,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.get<Page<PersonResponse>>(
            "/admin/people",
            {
                params: {
                    ...params,
                    search,
                },
                ...config,
            }
        ),

    getById: (
        personId: number,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.get<PersonResponse>(
            `/admin/people/${personId}`,
            config
        ),

    create: (
        formData: FormData,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.post<PersonResponse>(
            "/admin/people",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                ...config,
            }
        ),

    update: (
        personId: number,
        formData: FormData,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.patch<PersonResponse>(
            `/admin/people/${personId}`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                ...config,
            }
        ),


    delete: (
        personId: number,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.delete(
            `/admin/people/${personId}`,
            config
        ),
};