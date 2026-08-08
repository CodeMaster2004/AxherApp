import { seriesApi } from "@/core/api/endpoints/AdminSeriesApi";
import { SeriesDetail } from "@/entities/types";


export const seriesService = {

    getByContentId: async(contentId: number, signal?: AbortSignal): Promise<SeriesDetail> =>{
        const res = await seriesApi.getByContentId(contentId, { signal });
        return res.data;
    }
}