import axiosClient from "@/core/api/axiosClient";
import { CinematicRoleAiTranslationRequest, CinematicRoleAiTranslationResponse, CinematicRoleRequest, CinematicRoleResponse, CinematicRoleTranslationRequest, CinematicRoleTranslationResponse, Page, PaginationParams } from "@/entities/types";
import { AxiosRequestConfig } from "axios";

export const AdminCinematicRoleApi = {

    getAll: (
        params: PaginationParams,
        search?: string,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.get<Page<CinematicRoleResponse>>(
            "/admin/cinematic-roles",
            {
                params: {
                    ...params,
                    search,
                },
                ...config,
            }
        ),

    getById: (
        cinematicRoleId: number,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.get<CinematicRoleResponse>(
            `/admin/cinematic-roles/${cinematicRoleId}`,
            config
        ),

    create: (
        data: CinematicRoleRequest,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.post<CinematicRoleResponse>(
            "/admin/cinematic-roles",
            data,
            config
        ),

    update: (
        cinematicRoleId: number,
        data: CinematicRoleRequest,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.patch<CinematicRoleResponse>(
            `/admin/cinematic-roles/${cinematicRoleId}`,
            data,
            config
        ),

    delete: (
        cinematicRoleId: number,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.delete(
            `/admin/cinematic-roles/${cinematicRoleId}`,
            config
        ),

    translations: {

        getAll: (
            roleId: number,
            config?: AxiosRequestConfig
        ) =>
            axiosClient.get<CinematicRoleTranslationResponse[]>(
                `/admin/cinematic-roles/${roleId}/translations`,
                config
            ),

        create: (
            roleId: number,
            data: CinematicRoleTranslationRequest,
            config?: AxiosRequestConfig
        ) =>
            axiosClient.post<CinematicRoleTranslationResponse>(
                `/admin/cinematic-roles/${roleId}/translations`,
                data,
                config
            ),

        update: (
            roleId: number,
            languageId: number,
            data: CinematicRoleTranslationRequest,
            config?: AxiosRequestConfig
        ) =>
            axiosClient.patch<CinematicRoleTranslationResponse>(
                `/admin/cinematic-roles/${roleId}/translations/${languageId}`,
                data,
                config
            ),

        translateWithAi: (
            roleId: number,
            sourceLanguageId: number,
            data: CinematicRoleAiTranslationRequest,
            config?: AxiosRequestConfig
        ) =>
            axiosClient.post<CinematicRoleAiTranslationResponse>(
                `/admin/cinematic-roles/${roleId}/translations/${sourceLanguageId}/translate`,
                data,
                config
            ),

        delete: (
            roleId: number,
            languageId: number,
            config?: AxiosRequestConfig
        ) =>
            axiosClient.delete(
                `/admin/cinematic-roles/${roleId}/translations/${languageId}`,
                config
            ),
    },
};