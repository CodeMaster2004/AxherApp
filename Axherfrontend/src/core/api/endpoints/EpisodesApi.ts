import { EpisodeDetail, Page, PaginationParams } from "@/entities/types";
import { AxiosRequestConfig } from "axios";
import axiosClient from "../axiosClient";



export const episodesApi ={

    getBySeasonId: (
        seasonId: number,
        params: PaginationParams,
        config?: AxiosRequestConfig
    )=> axiosClient.get<Page<EpisodeDetail>>(`/seasons/${seasonId}/episodes`, {
        params: {...params},
        ...config
    }),

    getById: (seasonId: number, episodeId: number, config?: AxiosRequestConfig) =>
        axiosClient.get<EpisodeDetail>(`/seasons/${seasonId}/episodes/${episodeId}`, config),

    create: (seasonId: number, formData: FormData, config?: AxiosRequestConfig) =>
        axiosClient.post<EpisodeDetail>(`/seasons/${seasonId}/episodes`, formData,{
            headers: {"Content-type": "multipart/form-data"},
            ...config
        }),

    update: (seasonId: number, episodeId: number, formData: FormData, config?: AxiosRequestConfig) =>
        axiosClient.patch<EpisodeDetail>(`/seasons/${seasonId}/episodes/${episodeId}`, formData, {
            headers: {"Content-type": "multipart/form-data"},
            ...config
        }),

    delete: (seasonId: number, episodeId: number, config?: AxiosRequestConfig) =>
        axiosClient.delete(`/seasons/${seasonId}/episodes/${episodeId}`, config),

    
}