import axiosClient from "@/core/api/axiosClient";
import { ContentDetail, ContentQueryParams, Page } from "@/entities/types";
import { AxiosRequestConfig } from "axios";

export const publicContentApi = {

    getAll:(
        params: ContentQueryParams,
    ) => 
        axiosClient.get<Page<ContentDetail>>(
            "/public/contents",
            {
                params
            }
        ),
        
    search: (
        params: ContentQueryParams,
        config?: AxiosRequestConfig
    ) => axiosClient.get<Page<ContentDetail>>("/public/contents/search", {
        params,
        ...config
    }),

    getById: (id: number) =>
        axiosClient.get<ContentDetail>(
            `/public/contents/${id}`
        )
}