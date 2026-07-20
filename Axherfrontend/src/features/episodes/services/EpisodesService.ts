import { episodesApi } from "@/core/api/endpoints/EpisodesApi";
import { EpisodeDetail, Page, PaginationParams } from "@/entities/types";
import { AxiosProgressEvent } from "axios";



export const episodesService = {

    getBySeasonId: async(
        seasonId: number,
        params: PaginationParams,
        signal?: AbortSignal
    ): Promise<Page<EpisodeDetail>> => {
        const res = await episodesApi.getBySeasonId(seasonId, params , { signal });
        return res.data;
    },

    getById: async(
        seasonId: number,
        episodeId: number,
        signal?: AbortSignal
    ): Promise<EpisodeDetail> => {
        const res = await episodesApi.getById(seasonId, episodeId, { signal });
        return res.data;
    },

    create: async(
        seasonId: number,
        formData: FormData,
        onUploadProgress?: (progressEvent: AxiosProgressEvent) => void,
        signal?: AbortSignal
    ): Promise<EpisodeDetail> => {
        const res = await episodesApi.create(seasonId, formData, { signal, onUploadProgress });
        return res.data;
    },
  

    update: async(
        seasonId: number,
        episodeId: number,
        formData: FormData,
        onUploadProgress?: (progressEvent: AxiosProgressEvent) => void,
        signal?: AbortSignal
    ): Promise<EpisodeDetail> => {
        const res = await episodesApi.update(seasonId, episodeId, formData, { signal, onUploadProgress });
        return res.data;
    },


    delete: async(
        seasonId: number,
        episodeId: number,
        signal?: AbortSignal
    ): Promise<void> => {
        await episodesApi.delete(seasonId, episodeId, { signal });
    }
}