import { ContentCategoryRequest, ContentCategoryResponse, ContentCategoryTranslationRequest, ContentCategoryTranslationResponse, Page, PaginationParams } from "@/entities/types";
import type { AxiosRequestConfig } from "axios";
import axiosClient from "../axiosClient";

export const contentCategoriesApi = {

    getAll: (params: PaginationParams , search?: string, config?: AxiosRequestConfig) =>
        axiosClient.get<Page<ContentCategoryResponse>>("/categories",{
        params: {
            ...params,
            search,
        },
        ...config
        }),

    getById: (id: number, config?: AxiosRequestConfig) => 
        axiosClient.get<ContentCategoryResponse>(`/categories/${id}`, config),

    getBySlug: (
        slug: string,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.get<ContentCategoryResponse>(
            `/categories/slug/${slug}`,
            config
        ),
    
    create: (
        category: ContentCategoryRequest,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.post<ContentCategoryResponse>(
            "/categories",
            category,
            config
        ),

    update: (
        id: number,
        category: ContentCategoryRequest,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.patch<ContentCategoryResponse>(
            `/categories/${id}`,
            category,
            config
        ),
    
    delete: (id: number, config?: AxiosRequestConfig) => axiosClient.delete(`/categories/${id}`, config),

    translations: {
        
        getAll: (
            categoryId: number,
            config?: AxiosRequestConfig
        ) =>
            axiosClient.get<
                ContentCategoryTranslationResponse[]
            >(
                `/admin/content-categories/${categoryId}/translations`,
                config
            ),

        save: (
            categoryId: number,
            data: ContentCategoryTranslationRequest,
            config?: AxiosRequestConfig
        ) =>
            axiosClient.patch<
                ContentCategoryTranslationResponse
            >(
                `/admin/content-categories/${categoryId}/translations`,
                data,
                config
            ),

        delete: (
            categoryId: number,
            languageId: number,
            config?: AxiosRequestConfig
        ) =>
            axiosClient.delete(
                `/admin/content-categories/${categoryId}/translations/${languageId}`,
                config
            ),
    }
};
