import axiosClient from "@/core/api/axiosClient";
import { ContentDetail, ContentFiltersDto, ContentNewParams, ContentQueryParams, ContentType, Page, PaginationParams, SearchParams, UpcomingContent } from "@/entities/types";
import { AxiosRequestConfig } from "axios";

export const publicContentApi = {

    getAll:(
        params: ContentQueryParams,
    ) => 
        axiosClient.get<Page<ContentDetail>>(
            "/contents",
            {
                params
            }
        ),
        
    globalSearch: (
        params: SearchParams,
        config?: AxiosRequestConfig
    ) => axiosClient.get<Page<ContentDetail>>("/contents/search", {
        params,
        ...config
    }),

    getById: (id: number) =>
        axiosClient.get<ContentDetail>(
            `/contents/${id}`
        ),
    
    getUpcoming: (
        params: PaginationParams,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.get<Page<UpcomingContent>>(
            "/contents/upcoming",
            {
                ...params,
                ...config
            }
        ),

    getNewContent: (
        params: ContentNewParams,
        config?: AxiosRequestConfig
    ) => 
        axiosClient.get<Page<ContentDetail>>(
            "/contents/new",
            {
                params,
                ...config
            }
        ),

    getContent: (
        params: ContentQueryParams,
        config?: AxiosRequestConfig
    ) => 
        axiosClient.get<Page<ContentDetail>>(
            "contents",
            {
                params,
                ...config
            }
        ),

    getFilters: (
        type?: ContentType,
        config?: AxiosRequestConfig

    ) => 
        axiosClient.get<ContentFiltersDto>(
            "/contents/filters",
            {
                params: {
                    type
                },
                ...config
            }
        )

    
}