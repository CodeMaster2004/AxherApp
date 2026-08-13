import axiosClient from "@/core/api/axiosClient";
import { PageSection, PageSectionCreate, PageSectionUpdate } from "@/entities/types/pageSection.types";
import { AxiosRequestConfig } from "axios";

export const adminPageSectionApi = {

    getAllByPage: (
        page: string,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.get<PageSection[]>(
            "/admin/pages",
            {
                ...config,
                params: {
                    ...config?.params,
                    page
                }
            }
        ),

    getById: (
        id: number,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.get<PageSection>(
            `admin/pages/section/${id}`,
            config
        ),

    create: (
        data: PageSectionCreate,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.post<PageSection>(
            "admin/pages",
            data,
            config
        ),

    update: (
        id: number,
        data: Partial<PageSectionUpdate>,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.patch<PageSection>(
            `admin/pages/${id}`,
            data,
            config
        ),

    delete: (
        id: number,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.delete(
            `admin/pages/${id}`,
            config
        ),

    toggleActive: (
        id: number,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.patch<PageSection>(
            `/admin/pages/${id}/toggle`,
            {},
            config
        ),
}