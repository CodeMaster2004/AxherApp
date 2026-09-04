import axiosClient from "@/core/api/axiosClient";
import { ContentPersonRoleCreateRequest, ContentPersonRoleResponse, ContentPersonRoleUpdateRequest, Page, PaginationParams } from "@/entities/types";
import { AxiosRequestConfig } from "axios";

export const AdminContentPersonRoleApi = {

    getAll: (
    contentId: number,
    params: PaginationParams,
    search?: string,
    config?: AxiosRequestConfig
) =>
    axiosClient.get<Page<ContentPersonRoleResponse>>(
        `/admin/contents/${contentId}/people`,
        {
            params: {
                ...params,
                search,
            },
            ...config,
        }
    ),

    getById: (
        contentId: number,
        contentPersonRoleId: number,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.get<
            ContentPersonRoleResponse
        >(
            `/admin/contents/${contentId}/people/${contentPersonRoleId}`,
            config
        ),

    create: (
        contentId: number,
        data: ContentPersonRoleCreateRequest,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.post<
            ContentPersonRoleResponse
        >(
            `/admin/contents/${contentId}/people`,
            data,
            config
        ),

    update: (
        contentId: number,
        contentPersonRoleId: number,
        data: ContentPersonRoleUpdateRequest,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.patch<
            ContentPersonRoleResponse
        >(
            `/admin/contents/${contentId}/people/${contentPersonRoleId}`,
            data,
            config
        ),

    delete: (
        contentId: number,
        contentPersonRoleId: number,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.delete(
            `/admin/contents/${contentId}/people/${contentPersonRoleId}`,
            config
        ),
};