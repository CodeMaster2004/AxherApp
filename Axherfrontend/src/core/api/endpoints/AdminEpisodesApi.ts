import { EpisodeDetail, Page, PaginationParams, StatusUpdate } from "@/entities/types";
import { AxiosRequestConfig } from "axios";
import axiosClient from "../axiosClient";



export const AdminEpisodesApi ={

    getBySeasonId: (
        seasonId: number,
        params: PaginationParams,
        config?: AxiosRequestConfig
    )=> axiosClient.get<Page<EpisodeDetail>>(`/admin/seasons/${seasonId}/episodes`, {
        params: {...params},
        ...config
    }),

    getById: (seasonId: number, episodeId: number, config?: AxiosRequestConfig) =>
        axiosClient.get<EpisodeDetail>(`/admin/seasons/${seasonId}/episodes/${episodeId}`, config),

    create: (seasonId: number, formData: FormData, config?: AxiosRequestConfig) =>
        axiosClient.post<EpisodeDetail>(`/admin/seasons/${seasonId}/episodes`, formData,{
            headers: {"Content-type": "multipart/form-data"},
            ...config
        }),

    update: (seasonId: number, episodeId: number, formData: FormData, config?: AxiosRequestConfig) =>
        axiosClient.patch<EpisodeDetail>(`/admin/seasons/${seasonId}/episodes/${episodeId}`, formData, {
            headers: {"Content-type": "multipart/form-data"},
            ...config
        }),

    updateStatus: (seasonId: number, episodeId: number, statusUpdate: StatusUpdate, config?: AxiosRequestConfig) => 
        axiosClient.patch<EpisodeDetail>(`/admin/seasons/${seasonId}/episodes/${episodeId}/status`, statusUpdate, config),

    delete: (seasonId: number, episodeId: number, config?: AxiosRequestConfig) =>
        axiosClient.delete(`/admin/seasons/${seasonId}/episodes/${episodeId}`, config),

    
}