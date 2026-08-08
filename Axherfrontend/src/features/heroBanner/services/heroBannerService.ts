import { AxiosProgressEvent } from "axios";
import { adminHeroBannerApi } from "@/core/api/endpoints/AdminHeroBannerApi";
import { HeroBanner, Page, PaginationParams } from "@/entities/types";


export const heroBannerService = {


    getAll: async(
        params: PaginationParams,
        search?:string,
        signal?: AbortSignal
    ): Promise<Page<HeroBanner>> => {

        const res = await adminHeroBannerApi.getAll(
            params,
            search,
            {
                signal
            }
        );

        return res.data;
    },



    getById: async(
        id:number,
        signal?:AbortSignal
    ):Promise<HeroBanner>=>{

        const res = await adminHeroBannerApi.getById(
            id,
            {
                signal
            }
        );

        return res.data;
    },



    create: async(
        formData:FormData,
        onUploadProgress?:(
            progressEvent:AxiosProgressEvent
        )=>void,
        signal?:AbortSignal
    ):Promise<HeroBanner>=>{


        const res = await adminHeroBannerApi.create(
            formData,
            {
                signal,
                onUploadProgress
            }
        );


        return res.data;

    },



    update: async(
        id:number,
        formData:FormData,
        onUploadProgress?:(
            progressEvent:AxiosProgressEvent
        )=>void,
        signal?:AbortSignal
    ):Promise<HeroBanner>=>{


        const res = await adminHeroBannerApi.update(
            id,
            formData,
            {
                signal,
                onUploadProgress
            }
        );


        return res.data;

    },



    toggleActive: async(
        id:number,
        signal?:AbortSignal
    ):Promise<HeroBanner>=>{

        const res = await adminHeroBannerApi.toggleActive(
            id,
            {
                signal
            }
        );

        return res.data;
    },



    delete: async(
        id:number,
        signal?:AbortSignal
    ):Promise<void>=>{

        await adminHeroBannerApi.delete(
            id,
            {
                signal
            }
        );

    }

}