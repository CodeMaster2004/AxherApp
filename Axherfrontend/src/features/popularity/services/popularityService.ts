import { popularityApi } from "@/core/api/endpoints/PopularityApi";
import { ContentFeatured, ContentType, Page, PaginationParams, TopRatedContent, TrendingContent } from '../../../entities/types';

export const popularityService = {

    contentFeatured: async(): Promise<ContentFeatured[]> => {
        const res = await popularityApi.contentFeatured();
        return res.data;
    },
    
    trending: async( params: PaginationParams,  type?: ContentType,signal?: AbortSignal): Promise<Page<TrendingContent>> => {

        const res = await popularityApi.trending(
            params,
            type,
            { signal }
        );
        return res.data;
    },



    topRated: async(type?: ContentType, signal?: AbortSignal): Promise<TopRatedContent[]> => {
        const res = await popularityApi.topRated(
            type,
            { signal }
        );
        return res.data;
    }
};