import axiosClient from "@/core/api/axiosClient";
import { EpisodeDetail, Page, PaginationParams, UpcomingEpisode } from "@/entities/types";
import { AxiosRequestConfig } from "axios";

export const episodesApi = {

    getBySeasonId: (seasonId: number, params: PaginationParams, config?: AxiosRequestConfig) => 
            axiosClient.get<Page<EpisodeDetail>>(`/seasons/${seasonId}/episodes`, {
                    params,
                    ...config
            }),
    getUpcomingBySeasonId:(
        seasonId: number,
        params: PaginationParams,
        config?: AxiosRequestConfig
    ) => 
        axiosClient.get<Page<UpcomingEpisode>>(
                `/seasons/${seasonId}/episodes/upcoming`,
                {
                        params,
                        ...config
                }
        )
}