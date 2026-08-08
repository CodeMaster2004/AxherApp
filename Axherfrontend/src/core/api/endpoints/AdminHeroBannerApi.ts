import { AxiosRequestConfig } from "axios";
import axiosClient from "../axiosClient";
import { HeroBanner, Page, PaginationParams } from "@/entities/types";

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
        )
}
    
