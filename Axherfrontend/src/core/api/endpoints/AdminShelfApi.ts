import axiosClient from "@/core/api/axiosClient";
import { Page, PaginationParams } from "@/entities/types";
import { ContentShelf, ContentShelfAiTranslationRequest, ContentShelfAiTranslationResponse, ContentShelfTranslationRequest, ContentShelfTranslationResponse, CreateShelf, ShelfOption, UpdateShelf } from "@/entities/types/shelf.types";
import { AxiosRequestConfig } from "axios";

export const adminShelfApi = {

    getAll: (
        params: PaginationParams,
        search?: string,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.get<Page<ContentShelf>>(
            "/admin/shelves",
            {
                params: {
                    ...params,
                    search,
                },
                ...config,
            }
        ),
    
    getById: (
        id: number,
        config?: AxiosRequestConfig
    ) => axiosClient.get<ContentShelf>(
        `/admin/shelves/${id}`,
         config
    ),

    getOptions: (
        target: string,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.get<ShelfOption[]>(
            `/admin/shelves/options?target=${target}`,
            config
        ),

    create: (
        data: CreateShelf,
        config?: AxiosRequestConfig
    ) => 
        axiosClient.post<ContentShelf>(
            "/admin/shelves",
            data,
            config
        ),

    update: (
        id: number,
        data: UpdateShelf,
        config?: AxiosRequestConfig
    ) => 
        axiosClient.patch<ContentShelf>(
            `/admin/shelves/${id}`,
            data,
            config
        ),

    toggleActive: (
        id: number,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.patch<ContentShelf>(
            `/admin/shelves/${id}/toggle`,
            {},
            config
        ),

    delete: (
        id: number,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.delete(
            `/admin/shelves/${id}`,
            config
        ),

    translations: {

        getAll: (
            shelfId: number,
            config?: AxiosRequestConfig
        ) =>
            axiosClient.get<
                ContentShelfTranslationResponse[]
            >(
                `/admin/content-shelves/${shelfId}/translations`,
                config
            ),


        create: (
            shelfId: number,
            data: ContentShelfTranslationRequest,
            config?: AxiosRequestConfig
        ) =>
            axiosClient.post<ContentShelfTranslationResponse>(
                `/admin/content-shelves/${shelfId}/translations`,
                data,
                config
            ),

        update: (
            shelfId: number,
            languageId: number,
            data: ContentShelfTranslationRequest,
            config?: AxiosRequestConfig
        ) =>
            axiosClient.patch<ContentShelfTranslationResponse>(
                `/admin/content-shelves/${shelfId}/translations/${languageId}`,
                data,
                config
            ),

        translateWithAi: (
            shelfId: number,
            sourceLanguageId: number,
            data: ContentShelfAiTranslationRequest,
            config?: AxiosRequestConfig
        ) =>
            axiosClient.post<ContentShelfAiTranslationResponse>(
                `/admin/content-shelves/${shelfId}/translations/${sourceLanguageId}/translate`,
                data,
                config
            ),


        delete: (
            shelfId: number,
            languageId: number,
            config?: AxiosRequestConfig
        ) =>
            axiosClient.delete(
                `/admin/content-shelves/${shelfId}/translations/${languageId}`,
                config
            ),
    },
}