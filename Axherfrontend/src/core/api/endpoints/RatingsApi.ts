import axiosClient from '@/core/api/axiosClient';
import { AxiosRequestConfig } from 'axios';
import { Page, PaginationParams, RatingRequest, RatingResponse, RatingSummary } from '../../../entities/types';

export const ratingsApi = {

    getById: (id: number, config?: AxiosRequestConfig) => 
        axiosClient.get<RatingResponse>(`ratings/${id}`, config),

    getByUser: (userId: number, params: PaginationParams, config?: AxiosRequestConfig) =>
        axiosClient.get<Page<RatingResponse>>(`ratings/user/${userId}`, {
            params,
            ...config
        }),

    getByType: (targetType: string, targetId: number, params: PaginationParams, config?: AxiosRequestConfig) =>
        axiosClient.get<Page<RatingResponse>>(`ratings/target`, {
            params: {targetType, targetId, ...params},
            ...config
        }),
    
    getSummary: (
        targetType: string,
        targetId: number,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.get<RatingSummary>("ratings/summary", {
            params:{
                targetType,
                targetId
            },
            ...config
        }),

    create: (ratings: Omit<RatingRequest, "ratingId">, config?: AxiosRequestConfig) =>
        axiosClient.post<RatingResponse>("/ratings", ratings, config),

    update: (id: number, ratings: Partial<RatingRequest>, config?: AxiosRequestConfig) =>
        axiosClient.patch<RatingResponse>(`/ratings/${id}`, ratings, config),

    delete: (id: number, config?: AxiosRequestConfig) => axiosClient.delete(`/ratings/${id}`, config),

    getUserRating: (
        userId: number,
        targetType: string,
        targetId: number,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.get<RatingResponse>("ratings/user-rating", {
            params: {
                userId,
                targetType,
                targetId
            },
            ...config
        }),
}