import axiosClient from "@/core/api/axiosClient";
import { Page, PaginationParams, SeasonDetail, UpcomingSeason } from "@/entities/types";
import { AxiosRequestConfig } from "axios";

export const seasonsApi = {

    getBySeriesId: (seriesId: number, params: PaginationParams, config?: AxiosRequestConfig) =>
        axiosClient.get<Page<SeasonDetail>>(`/series/${seriesId}/seasons`, 
            {
            
                params,
                ...config
            }
    ),

    getUpcomingBySeriesId: (
        seriesId: number,
        config?: AxiosRequestConfig
    ) => 
        axiosClient.get<UpcomingSeason[]>(
            `/series/${seriesId}/seasons/upcoming`,
            config
        ),
            
        
}