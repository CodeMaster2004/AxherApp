import { ContentAiTranslationRequest, ContentAiTranslationResponse, ContentDetail, ContentQueryParams, ContentTranslation, ContentTranslationRequest, Page, PaginationParams, StatusUpdate } from "@/entities/types";
import { AxiosRequestConfig } from "axios";
import axiosClient from "../axiosClient";


export const contentApi = {

    getAll: (params: PaginationParams, search?: string, config?: AxiosRequestConfig) =>
        axiosClient.get<Page<ContentDetail>>("/admin/contents", {
            params: {...params, search},
            ...config
        }),

    search: (
        params: ContentQueryParams,
        config?: AxiosRequestConfig
    ) => axiosClient.get<Page<ContentDetail>>("/admin/contents/search", {
        params,
        ...config
    }),

    getWithDiscount: (params: PaginationParams, config?: AxiosRequestConfig) =>
        axiosClient.get<Page<ContentDetail>>("/admin/contents/with-discount", {
            params,
            ...config
        }),

    getById: (id: number, config?: AxiosRequestConfig) =>
        axiosClient.get<ContentDetail>(`/admin/contents/${id}`, config),


    create: (formData: FormData, config?: AxiosRequestConfig) =>
        axiosClient.post<ContentDetail>("/admin/contents", formData, {
            headers: {"Content-type": "multipart/form-data"},
            ...config
        }),

    update: (id: number, formData: FormData, config?: AxiosRequestConfig) =>
        axiosClient.patch<ContentDetail>(`/admin/contents/${id}`, formData, {
            headers: {"Content-type": "multipart/form-data"},
            ...config
        }),

    updateStatus: (id: number, statusUpdate: StatusUpdate, config?: AxiosRequestConfig) =>
        axiosClient.patch<ContentDetail>(`/admin/contents/${id}/status`, statusUpdate, config),

    delete: (id: number, config?: AxiosRequestConfig) =>
        axiosClient.delete(`/admin/contents/${id}`, config),

    translations: {

        getTranslations: (
            contentId: number,
            contig?: AxiosRequestConfig
        ) =>
            axiosClient.get<ContentTranslation[]>(
                `/admin/contents/${contentId}/translations`,
                contig
            ),
        create: (
            contentId: number,
            data: ContentTranslationRequest,
            config?: AxiosRequestConfig
        ) =>
            axiosClient.post<ContentTranslation>(
                `/admin/contents/${contentId}/translations`,
                data,
                config
            ),

        update: (
            contentId: number,
            languageId: number,
            data: ContentTranslationRequest,
            config?: AxiosRequestConfig
        ) =>
            axiosClient.patch<ContentTranslation>(
                `/admin/contents/${contentId}/translations/${languageId}`,
                data,
                config
            ),

    translateWithAi: (
        contentId: number,
        sourceLanguageId: number,
        data: ContentAiTranslationRequest,
        config?: AxiosRequestConfig
    ) => 
        axiosClient.post<ContentAiTranslationResponse>(
            `/admin/contents/${contentId}/translations/${sourceLanguageId}/translate`,
            data,
            config
        ),

        deleteTranslation: (
            contentId: number,
            languageId: number,
            config?: AxiosRequestConfig
        ) => 
            axiosClient.delete(
                `/admin/contents/${contentId}/translations/${languageId}`,
                config
            )
    }
    
}