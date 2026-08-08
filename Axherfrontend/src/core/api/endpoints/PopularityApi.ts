import axiosClient from '@/core/api/axiosClient';
import { ContentFeatured, ContentType, Page, PaginationParams, PopularContent, TopRatedContent, TrendingContent } from '@/entities/types';
import { AxiosRequestConfig } from 'axios';
export const popularityApi = {

    contentFeatured: () => 
        axiosClient.get<ContentFeatured[]>(
            "/popularity/featured"
        ),
        
    trending: ( params: PaginationParams,type?: ContentType, config?: AxiosRequestConfig) => axiosClient.get<Page<TrendingContent>>(
        "/popularity/trending",
        {
            params: {
                ...params,
                type
            },
            ...config
        }
    ),



    topRated: (type?: ContentType, config?: AxiosRequestConfig) =>
        axiosClient.get<TopRatedContent[]>(
            "/popularity/top-rated",
            {
                params: {
                    type
                },
                ...config
            }
        )

    
};
       