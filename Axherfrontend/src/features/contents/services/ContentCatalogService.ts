import { publicContentApi } from "@/core/api/endpoints/ContentApi";
import { ContentDetail, ContentFiltersDto, ContentQueryParams, ContentType, Page } from "@/entities/types";

export const contentCatalogService = {

    getAll: async(
        params: ContentQueryParams,
        signal?: AbortSignal
    ): Promise<Page<ContentDetail>> => {
        const res = await publicContentApi.getContent(params, { signal });
        return res.data;
    },

    getFilters: async(
        type?: ContentType,
        signal?: AbortSignal
    ): Promise<ContentFiltersDto> => {
        const res = await publicContentApi.getFilters(type, { signal });
        return res.data;
    }
    
    
}