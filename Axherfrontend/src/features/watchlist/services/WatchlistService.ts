import { watchlistApi } from "@/core/api/endpoints/WatchlistApi";
import {
    Page,
    PaginationParams,
    WatchlistRequest,
    WatchlistResponse
} from "@/entities/types";

export const watchlistService = {

    getAll: async (
        params: PaginationParams
    ): Promise<Page<WatchlistResponse>> => {

        const response = await watchlistApi.getAll(params);

        return response.data;
    },

    getById: async (
        watchlistId: number
    ): Promise<WatchlistResponse> => {

        const response = await watchlistApi.getById(watchlistId);

        return response.data;
    },

    isInWatchlist: async (
        contentId: number
    ): Promise<boolean> => {

        const response = await watchlistApi.isInWatchlist(contentId);

        return response.data;
    },

    add: async (
        data: WatchlistRequest
    ): Promise<WatchlistResponse> => {

        const response = await watchlistApi.add(data);

        return response.data;
    },

    remove: async (
        contentId: number
    ): Promise<void> => {

        await watchlistApi.remove(contentId);
    }

};