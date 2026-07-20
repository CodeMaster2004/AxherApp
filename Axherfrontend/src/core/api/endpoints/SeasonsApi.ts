import { Page, PaginationParams, SeasonDetail } from "@/entities/types";
import { AxiosRequestConfig } from "axios";
import axiosClient from "../axiosClient";



export const seasonsApi = {

    getBySeriesId: (
        seriesId: number,
        params: PaginationParams,
        config?: AxiosRequestConfig
    ) => axiosClient.get<Page<SeasonDetail>>(`/series/${seriesId}/seasons`, {
        params,
        ...config
    }),


    getById: (seriesId: number, seasonId: number, config?: AxiosRequestConfig) =>
        axiosClient.get<SeasonDetail>(`/series/${seriesId}/seasons/${seasonId}`, config),

    create: (seriesId: number, formData: FormData, config?: AxiosRequestConfig) =>
        axiosClient.post<SeasonDetail>(`/series/${seriesId}/seasons`, formData, {
            headers: {"Content-Type": "multipart/form-data"},
            ...config
        }),

    update: (seriesId: number, seasonId: number, formData: FormData, config?: AxiosRequestConfig) =>
        axiosClient.patch<SeasonDetail>(`/series/${seriesId}/seasons/${seasonId}`, formData,{
            headers: {"Content-type": "multipart/form-data"},
            ...config
        }),

    delete: (seriesId: number, seasonId: number, config?: AxiosRequestConfig) =>
        axiosClient.delete(`/series/${seriesId}/seasons/${seasonId}`, config),


}