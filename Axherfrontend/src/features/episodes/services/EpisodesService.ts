import { AdminEpisodesApi } from "@/core/api/endpoints/AdminEpisodesApi";
import { episodesApi } from "@/core/api/endpoints/EpisodesApi";
import { EpisodeDetail, Page, PaginationParams, StatusUpdate } from "@/entities/types";
import { AxiosProgressEvent } from "axios";



export const episodesService = {

    getAdminBySeasonId: async(
        seasonId: number,
        params: PaginationParams,
        signal?: AbortSignal
    ): Promise<Page<EpisodeDetail>> => {
        const res = await AdminEpisodesApi.getBySeasonId(seasonId, params , { signal });
        return res.data;
    },

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
        const res = await AdminEpisodesApi.getById(seasonId, episodeId, { signal });
        return res.data;
    },

    create: async(
        seasonId: number,
        formData: FormData,
        onUploadProgress?: (progressEvent: AxiosProgressEvent) => void,
        signal?: AbortSignal
    ): Promise<EpisodeDetail> => {
        const res = await AdminEpisodesApi.create(seasonId, formData, { signal, onUploadProgress });
        return res.data;
    },
  

    update: async(
        seasonId: number,
        episodeId: number,
        formData: FormData,
        onUploadProgress?: (progressEvent: AxiosProgressEvent) => void,
        signal?: AbortSignal
    ): Promise<EpisodeDetail> => {
        const res = await AdminEpisodesApi.update(seasonId, episodeId, formData, { signal, onUploadProgress });
        return res.data;
    },

    updateStatus: async(
        seasonId: number,
        episodeId: number,
        statusUpdate: StatusUpdate,
        signal?: AbortSignal
    ): Promise<EpisodeDetail> => {
        const res = await AdminEpisodesApi.updateStatus(seasonId, episodeId, statusUpdate, { signal });
        return res.data;
    },


    delete: async(
        seasonId: number,
        episodeId: number,
        signal?: AbortSignal
    ): Promise<void> => {
        await AdminEpisodesApi.delete(seasonId, episodeId, { signal });
    }
}