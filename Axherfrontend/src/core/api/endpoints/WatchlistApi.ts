import axiosClient from "@/core/api/axiosClient"
import { Page, PaginationParams, WatchlistRequest, WatchlistResponse } from "@/entities/types"
import { AxiosRequestConfig } from "axios"

export const watchlistApi = {

    getAll: (
        params: PaginationParams,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.get<Page<WatchlistResponse>>(
            "/watchlist",
            {
                params,
                ...config
            }
        ),

    getById: (
        watchlistId: number,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.get<WatchlistResponse>(
            `/watchlist/${watchlistId}`,
            config
        ),

    isInWatchlist: (
        contentId: number,
        config?: AxiosRequestConfig
    ) => 
        axiosClient.get<boolean>(
            "/watchlist/check",
            {
                params: { contentId },
                ...config
            }
        ),

    add: (
        data: WatchlistRequest,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.post<WatchlistResponse>(
            "/watchlist",
            data,
            config
        ),

    remove: (
        contentId: number,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.delete<void>(
            `/watchlist/${contentId}`,
            config
        )

    
}