import { adminSeasonsApi } from "@/core/api/endpoints/AdminSeasonsApi";
import { seasonsApi } from "@/core/api/endpoints/SeasonsApi";
import { Page, PaginationParams, SeasonDetail, SeasonTranslation, SeasonTranslationRequest, StatusUpdate, UpcomingSeason } from "@/entities/types";
import { AxiosProgressEvent } from "axios";



export const seasonsService = {

    getAdminBySeriesId: async(
        seriesId: number,
        params: PaginationParams,
        signal?: AbortSignal
    ): Promise<Page<SeasonDetail>> => {
        const res = await adminSeasonsApi.getBySeriesId(seriesId, params, { signal });
        return res.data;
    },

    getBySeriesId: async(
        seriesId: number,
        params: PaginationParams,
        signal?: AbortSignal
    ): Promise<Page<SeasonDetail>> => {
        const res = await seasonsApi.getBySeriesId(seriesId, params, { signal });
        return res.data;
    },

    getUpcomingBySeriesId: async(
        seriesId: number,
        signal?: AbortSignal
    ): Promise<UpcomingSeason[]> => {
        const res = await seasonsApi.getUpcomingBySeriesId(
            seriesId,
            { signal }
        );

        return res.data;
    },
    

    getById: async(
        seriesId: number,
        seasonId: number,
        signal?: AbortSignal
    ): Promise<SeasonDetail> => {
        const res = await adminSeasonsApi.getById(seriesId, seasonId, { signal });
        return res.data;
    },
    
    create: async(
        seriesId: number,
        formData: FormData,
        onUploadProgress?: (progressEvent: AxiosProgressEvent) => void,
        signal?: AbortSignal
    ): Promise<SeasonDetail> => {
        const res = await adminSeasonsApi.create(seriesId, formData, { signal, onUploadProgress });
        return res.data;
    },

    update: async(
        seriesId: number,
        seasonId: number,
        formData: FormData,
        onUploadProgress?: (progressEvent: AxiosProgressEvent) => void,
        signal?: AbortSignal
    ): Promise<SeasonDetail> => {
        const res = await adminSeasonsApi.update(seriesId, seasonId, formData, { signal, onUploadProgress });
        return res.data;
    },

    updateStatus: async(
        seriesId: number,
        seasonId: number,
        statusUpdate: StatusUpdate,
        signal?: AbortSignal
    ): Promise<SeasonDetail> => {
        const res = await adminSeasonsApi.updateStatus(seriesId, seasonId, statusUpdate, { signal });
        return res.data;
    },
    

    delete: async(
        seriesId: number,
        seasonId: number,
        signal?: AbortSignal
    ): Promise<void> => {
        await adminSeasonsApi.delete(seriesId, seasonId, { signal });
    },

    getTranslations: async (
        seasonId: number,
        signal?: AbortSignal
    ): Promise<SeasonTranslation[]> => {

        const res = await adminSeasonsApi.getTranslations(
            seasonId,
            { signal }
        );

        return res.data;
    },

    saveTranslation: async (
        seasonId: number,
        data: SeasonTranslationRequest,
        signal?: AbortSignal
    ): Promise<SeasonTranslation> => {

        const res = await adminSeasonsApi.saveTranslation(
            seasonId,
            data,
            { signal }
        );

        return res.data;
    },

    deleteTranslation: async (
        seasonId: number,
        languageId: number,
        signal?: AbortSignal
    ): Promise<void> => {

        await adminSeasonsApi.deleteTranslation(
            seasonId,
            languageId,
            { signal }
        );
    },
    
}