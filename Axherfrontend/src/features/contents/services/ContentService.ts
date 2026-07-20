import { contentApi } from "@/core/api/endpoints/ContentApi";
import { ContentDetail, ContentQueryParams, Page, PaginationParams, StatusUpdate } from "@/entities/types";
import { AxiosProgressEvent } from "axios";



export const contentService = {

    getAll: async(
        params: PaginationParams,
        search?: string,
        signal?: AbortSignal
    ): Promise<Page<ContentDetail>> => {
        const res = await contentApi.getAll(params, search, { signal });
        return res.data;
    },

    search: async (
        params: ContentQueryParams,
        signal?: AbortSignal
            
    ): Promise<Page<ContentDetail>> => {
        const res = await contentApi.search(params, { signal});
        return res.data;
    },

    getWithDiscount: async (
        params: PaginationParams,
        signal?: AbortSignal
    ): Promise<Page<ContentDetail>> => {
        const res = await contentApi.getWithDiscount(params, { signal});
        return res.data;
    },

    getById: async(id: number, signal?: AbortSignal): Promise<ContentDetail> =>{
        const res = await contentApi.getById(id, { signal });
        return res.data;
    },

    create: async(
        formData: FormData,
        onUploadProgress?: (progressEvent: AxiosProgressEvent) => void,
        signal?: AbortSignal
    ): Promise<ContentDetail> =>{
        const res = await contentApi.create(formData, { signal, onUploadProgress });
        return res.data;
    },

    update: async (
        id: number,
        formData: FormData,
        onUploadProgress?: (progressEvent: AxiosProgressEvent) => void,
        signal?: AbortSignal
    ): Promise<ContentDetail> => {
        const res = await contentApi.update(id, formData, { signal, onUploadProgress });
        return res.data;
    },
    
    updateStatus: async (
        id: number,
        statusUpdate: StatusUpdate,
        signal?: AbortSignal
    ): Promise<ContentDetail> =>{
        const res = await contentApi.updateStatus(id, statusUpdate, { signal });
        return res.data;
    },

    delete: async(id: number, signal?: AbortSignal): Promise<void> =>{
        await contentApi.delete(id, { signal });
    }
}