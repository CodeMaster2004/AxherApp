import { playbackHistoryApi } from "@/core/api/endpoints/PlaybackHistoryApi";
import { ContinueWatching, PlaybackHistoryRequest, PlaybackHistoryResponse } from "@/entities/types";

export const playbackHistoryService = {

    saveOrUpdate: async(
        data: PlaybackHistoryRequest,
        signal?: AbortSignal
    ): Promise<PlaybackHistoryResponse> => {
        
        const res = await playbackHistoryApi.saveOrUpdate(
            data,
            { signal }
        );
        return res.data;
    },

    getHistory: async (
        signal?: AbortSignal
    ): Promise<PlaybackHistoryResponse[]> => {

        const res = await playbackHistoryApi.getHistory(
            { signal }
        );

        return res.data;
    },

    getProgress: async(
        contentId: number,
        episodeId?: number,
        signal?: AbortSignal
    ): Promise<PlaybackHistoryResponse> => {

        const res = await playbackHistoryApi.getProgress(
            contentId,
            episodeId,
            { signal }
        );
        return res.data;
    },

    continueWatching: async(
        signal?: AbortSignal
    ): Promise<ContinueWatching[]> => {

        const res = await playbackHistoryApi.continueWatching(
            { signal }
        );

        return res.data;
    }
    
};