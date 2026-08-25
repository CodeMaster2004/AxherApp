import { Page, PaginationParams, SeasonDetail, SeasonTranslation, SeasonTranslationRequest, StatusUpdate } from "@/entities/types";
import { AxiosRequestConfig } from "axios";
import axiosClient from "../axiosClient";



export const adminSeasonsApi = {

    getBySeriesId: (
        seriesId: number,
        params: PaginationParams,
        config?: AxiosRequestConfig
    ) => axiosClient.get<Page<SeasonDetail>>(`/admin/series/${seriesId}/seasons`, {
        params,
        ...config
    }),


    getById: (seriesId: number, seasonId: number, config?: AxiosRequestConfig) =>
        axiosClient.get<SeasonDetail>(`/admin/series/${seriesId}/seasons/${seasonId}`, config),

    create: (seriesId: number, formData: FormData, config?: AxiosRequestConfig) =>
        axiosClient.post<SeasonDetail>(`/admin/series/${seriesId}/seasons`, formData, {
            headers: {"Content-Type": "multipart/form-data"},
            ...config
        }),

    update: (seriesId: number, seasonId: number, formData: FormData, config?: AxiosRequestConfig) =>
        axiosClient.patch<SeasonDetail>(`/admin/series/${seriesId}/seasons/${seasonId}`, formData,{
            headers: {"Content-type": "multipart/form-data"},
            ...config
        }),
    
    updateStatus: (
        seriesId: number,
        seasonId: number,
        statusUpdate: StatusUpdate,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.patch(
            `/admin/series/${seriesId}/seasons/${seasonId}/status`,
            statusUpdate,
            config
        ),

    delete: (seriesId: number, seasonId: number, config?: AxiosRequestConfig) =>
        axiosClient.delete(`/admin/series/${seriesId}/seasons/${seasonId}`, config),

    getTranslations: (
        seasonId: number,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.get<SeasonTranslation[]>(
            `/admin/seasons/${seasonId}/translations`,
            config
        ),

    saveTranslation: (
        seasonId: number,
        data: SeasonTranslationRequest,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.patch<SeasonTranslation>(
            `/admin/seasons/${seasonId}/translations`,
            data,
            config
        ),

    deleteTranslation: (
        seasonId: number,
        languageId: number,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.delete(
            `/admin/seasons/${seasonId}/translations/${languageId}`,
            config
        ),


}