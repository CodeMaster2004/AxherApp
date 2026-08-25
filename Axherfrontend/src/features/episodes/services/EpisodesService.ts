import { AdminEpisodesApi } from "@/core/api/endpoints/AdminEpisodesApi";
import { episodesApi } from "@/core/api/endpoints/EpisodesApi";
import { EpisodeDetail, EpisodeTranslation, EpisodeTranslationRequest, Page, PaginationParams, StatusUpdate, UpcomingEpisode } from "@/entities/types";
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

    getUpcomingBySeasonId: async(
        seasonId: number,
        params: PaginationParams,
        signal?: AbortSignal
    ): Promise<Page<UpcomingEpisode>> => {
        const res = await episodesApi.getUpcomingBySeasonId(seasonId, params , { signal });
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
    },

    getTranslations: async (
        episodeId: number,
        signal?: AbortSignal
    ): Promise<EpisodeTranslation[]> => {

        const res = await AdminEpisodesApi.getTranslations(
            episodeId,
            { signal }
        );

        return res.data;
    },

    saveTranslation: async (
        episodeId: number,
        data: EpisodeTranslationRequest,
        signal?: AbortSignal
    ): Promise<EpisodeTranslation> => {

        const res = await AdminEpisodesApi.saveTranslation(
            episodeId,
            data,
            { signal }
        );

        return res.data;
    },

    deleteTranslation: async (
        episodeId: number,
        languageId: number,
        signal?: AbortSignal
    ): Promise<void> => {

        await AdminEpisodesApi.deleteTranslation(
            episodeId,
            languageId,
            { signal }
        );
    },
}