import axiosClient from "@/core/api/axiosClient";
import { ContinueWatching, PlaybackHistoryRequest, PlaybackHistoryResponse } from "@/entities/types";
import { AxiosRequestConfig } from "axios";

export const playbackHistoryApi = {

    saveOrUpdate: (data: PlaybackHistoryRequest, config?: AxiosRequestConfig) => 
        axiosClient.post<PlaybackHistoryResponse>(
            "/playback-history",
            data,
            config
        ),
    
    getHistory: (config?: AxiosRequestConfig) => 
        axiosClient.get<PlaybackHistoryResponse[]>(
            "/playback-history",
            config
        ),

    getProgress: (contentId: number, episodeId?: number, config?: AxiosRequestConfig) => 
        axiosClient.get<PlaybackHistoryResponse>(
            "/playback-history/progress",
            {
                params: {
                    contentId,
                    episodeId,
                },
                ...config
            }
        ),

    continueWatching: (config?: AxiosRequestConfig) =>
        axiosClient.get<ContinueWatching[]>(
            "/playback-history/continue-watching",
            config
        ),
};