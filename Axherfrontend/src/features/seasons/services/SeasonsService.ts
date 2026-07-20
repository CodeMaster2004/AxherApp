import { seasonsApi } from "@/core/api/endpoints/SeasonsApi";
import { Page, PaginationParams, SeasonDetail } from "@/entities/types";
import { AxiosProgressEvent } from "axios";



export const seasonsService = {

    getBySeriesId: async(
        seriesId: number,
        params: PaginationParams,
        signal?: AbortSignal
    ): Promise<Page<SeasonDetail>> => {
        const res = await seasonsApi.getBySeriesId(seriesId, params, { signal });
        return res.data;
    },

    getById: async(
        seriesId: number,
        seasonId: number,
        signal?: AbortSignal
    ): Promise<SeasonDetail> => {
        const res = await seasonsApi.getById(seriesId, seasonId, { signal });
        return res.data;
    },
    
    create: async(
        seriesId: number,
        formData: FormData,
        onUploadProgress?: (progressEvent: AxiosProgressEvent) => void,
        signal?: AbortSignal
    ): Promise<SeasonDetail> => {
        const res = await seasonsApi.create(seriesId, formData, { signal, onUploadProgress });
        return res.data;
    },

    update: async(
        seriesId: number,
        seasonId: number,
        formData: FormData,
        onUploadProgress?: (progressEvent: AxiosProgressEvent) => void,
        signal?: AbortSignal
    ): Promise<SeasonDetail> => {
        const res = await seasonsApi.update(seriesId, seasonId, formData, { signal, onUploadProgress });
        return res.data;
    },

    delete: async(
        seriesId: number,
        seasonId: number,
        signal?: AbortSignal
    ): Promise<void> => {
        await seasonsApi.delete(seriesId, seasonId, { signal });
    }
    
}