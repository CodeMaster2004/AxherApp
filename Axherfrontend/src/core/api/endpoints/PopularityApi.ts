import axiosClient from '@/core/api/axiosClient';
import { ContentFeatured, Page, PaginationParams, PopularContent } from '@/entities/types';
import { AxiosRequestConfig } from 'axios';
export const popularityApi = {

    contentFeatured: () => 
        axiosClient.get<ContentFeatured[]>(
            "/popularity/featured"
        ),
        
    trending: (params: PaginationParams, config?: AxiosRequestConfig) => axiosClient.get<Page<PopularContent>>(
        "/popularity/trending",
        {
            params,
            ...config
        }
    ),

    movies: (params: PaginationParams, config?: AxiosRequestConfig) => axiosClient.get<Page<PopularContent>>(
        "/popularity/movie",
        {
            params,
            ...config
        }
    ),

    series: (params: PaginationParams, config?: AxiosRequestConfig) => axiosClient.get<Page<PopularContent>>(
        "/popularity/series",
        {
            params,
            ...config
        }
    ),
};
       