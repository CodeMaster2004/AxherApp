import axiosClient from "@/core/api/axiosClient";
import { Page, PaginationParams } from "@/entities/types";
import { ContentShelf, CreateShelf, ShelfOption, UpdateShelf } from "@/entities/types/shelf.types";
import { AxiosRequestConfig } from "axios";

export const adminShelfApi = {

    getAll: (
        params: PaginationParams,
        search?: string,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.get<Page<ContentShelf>>(
            "/admin/shelves",
            {
                params: {
                    ...params,
                    search,
                },
                ...config,
            }
        ),
    
    getById: (
        id: number,
        config?: AxiosRequestConfig
    ) => axiosClient.get<ContentShelf>(
        `/admin/shelves/${id}`,
         config
    ),

    getOptions: (
        target: string,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.get<ShelfOption[]>(
            `/admin/shelves/options?target=${target}`,
            config
        ),

    create: (
        data: CreateShelf,
        config?: AxiosRequestConfig
    ) => 
        axiosClient.post<ContentShelf>(
            "/admin/shelves",
            data,
            config
        ),

    update: (
        id: number,
        data: UpdateShelf,
        config?: AxiosRequestConfig
    ) => 
        axiosClient.patch<ContentShelf>(
            `/admin/shelves/${id}`,
            data,
            config
        ),

    toggleActive: (
        id: number,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.patch<ContentShelf>(
            `/admin/shelves/${id}/toggle`,
            {},
            config
        ),

    delete: (
        id: number,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.delete(
            `/admin/shelves/${id}`,
            config
        )
}