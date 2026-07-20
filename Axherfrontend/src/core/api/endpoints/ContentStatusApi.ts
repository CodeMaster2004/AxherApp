import { ContentStatus, Page, PaginationParams } from "@/entities/types";
import { AxiosRequestConfig } from "axios";
import axiosClient from "../axiosClient";

export const contentStatusApi = {
   getAll: (params: PaginationParams, search?: string, config?: AxiosRequestConfig) =>
        axiosClient.get<Page<ContentStatus>>("/content-status", {
            params: {...params, search},
            ...config
        }),

    getById: (id: number, config?: AxiosRequestConfig) => 
        axiosClient.get<ContentStatus>(`/content-status/${id}`, config),

    create: (estadoPeliculas: Omit<ContentStatus, "contentStatusId">, config?: AxiosRequestConfig) =>
        axiosClient.post<ContentStatus>("/content-status", estadoPeliculas, config),

    update: (id: number, estadoPeliculas: Partial<ContentStatus>, config?: AxiosRequestConfig) =>
        axiosClient.patch<ContentStatus>(`/content-status/${id}`, estadoPeliculas, config),

    delete: (id: number, config?: AxiosRequestConfig) => axiosClient.delete(`/content-status/${id}`, config),
}
