import { popularityApi } from "@/core/api/endpoints/PopularityApi";
import { ContentFeatured, Page, PaginationParams, PopularContent } from '../../../entities/types';

export const popularityService = {

    contentFeatured: async(): Promise<ContentFeatured[]> => {
        const res = await popularityApi.contentFeatured();
        return res.data;
    },
    
    trending: async(params: PaginationParams, signal?: AbortSignal): Promise<Page<PopularContent>> => {

        const res = await popularityApi.trending(
            params,
            { signal }
        );
        return res.data;
    },

    movies: async(params: PaginationParams, signal?: AbortSignal): Promise<Page<PopularContent>> => {
        const res = await popularityApi.movies(
            params,
            { signal }
        );
        return res.data;
    },

    series: async(params: PaginationParams, signal?: AbortSignal): Promise<Page<PopularContent>> => {
        const res = await popularityApi.series(
            params,
            { signal }
        );
        return res.data;
    }
};