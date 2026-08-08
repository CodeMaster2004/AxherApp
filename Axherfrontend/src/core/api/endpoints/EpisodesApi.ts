import axiosClient from "@/core/api/axiosClient";
import { EpisodeDetail, Page, PaginationParams } from "@/entities/types";
import { AxiosRequestConfig } from "axios";

export const episodesApi = {

    getBySeasonId: (seasonId: number, params: PaginationParams, config?: AxiosRequestConfig) => 
            axiosClient.get<Page<EpisodeDetail>>(`/seasons/${seasonId}/episodes`, {
                    params,
                    ...config
            }),
}