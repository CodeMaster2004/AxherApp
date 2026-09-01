import { AxiosRequestConfig } from "axios";
import axiosClient from "../axiosClient";
import { HeroBanner, HeroBannerAiTranslationRequest, HeroBannerAiTranslationResponse, HeroBannerTranslationRequest, HeroBannerTranslationResponse, Page, PaginationParams } from "@/entities/types";

export const adminHeroBannerApi = {

    getAll:(
        params: PaginationParams,
        search?:string,
        config?:AxiosRequestConfig
    ) =>
        axiosClient.get<Page<HeroBanner>>(
            "/admin/hero",
            {
                params:{
                    ...params,
                    search
                },
                ...config
            }
        ),

    getById: (
        id: number,
        config?: AxiosRequestConfig
    ) => 
        axiosClient.get<HeroBanner>(
            `/admin/hero/${id}`,
            config
        ),

    create:(
        formData:FormData,
        config?:AxiosRequestConfig
    ) =>
        axiosClient.post<HeroBanner>(
            "/admin/hero",
            formData,
            {
                headers:{
                    "Content-Type":"multipart/form-data"
                },
                ...config
            }
        ),

    update:(
        id:number,
        formData:FormData,
        config?:AxiosRequestConfig
    ) =>
        axiosClient.patch<HeroBanner>(
            `/admin/hero/${id}`,
            formData,
            {
                headers:{
                    "Content-Type":"multipart/form-data"
                },
                ...config
            }
        ),

    toggleActive: (
        id: number,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.patch<HeroBanner>(
            `/admin/hero/${id}/toggle`,
            {},
            config
        ),

    delete: (
        id: number,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.delete(
            `/admin/hero/${id}`,
            config
        ),

    translations: {

        getAll: (
            heroBannerId: number,
            config?: AxiosRequestConfig
        ) =>
            axiosClient.get<
                HeroBannerTranslationResponse[]
            >(
                `/admin/hero-banners/${heroBannerId}/translations`,
                config
            ),

        create: (
            heroBannerId: number,
            data: HeroBannerTranslationRequest,
            config?: AxiosRequestConfig
        ) =>
            axiosClient.post<HeroBannerTranslationResponse>(
                `/admin/hero-banners/${heroBannerId}/translations`,
                data,
                config
            ),

        update: (
            heroBannerId: number,
            languageId: number,
            data: HeroBannerTranslationRequest,
            config?: AxiosRequestConfig
        ) =>
            axiosClient.patch<HeroBannerTranslationResponse>(
                `/admin/hero-banners/${heroBannerId}/translations/${languageId}`,
                data,
                config
            ),

        translateWithAi: (
            heroBannerId: number,
            sourceLanguageId: number,
            data: HeroBannerAiTranslationRequest,
            config?: AxiosRequestConfig
        ) =>
            axiosClient.post<HeroBannerAiTranslationResponse>(
                `/admin/hero-banners/${heroBannerId}/translations/${sourceLanguageId}/translate`,
                data,
                config
            ),


        delete: (
            heroBannerId: number,
            languageId: number,
            config?: AxiosRequestConfig
        ) =>
            axiosClient.delete(
                `/admin/hero-banners/${heroBannerId}/translations/${languageId}`,
                config
            ),

    },
}
    
