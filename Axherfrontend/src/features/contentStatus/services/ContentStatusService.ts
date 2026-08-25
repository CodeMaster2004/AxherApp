import { contentStatusApi } from "@/core/api/endpoints/ContentStatusApi";
import {  Page, PaginationParams } from "@/entities/types";
import { ContentStatusRequest, ContentStatusResponse } from "@/entities/types/status.types";

export const contentStatusService ={

    getAll: async (
        params: PaginationParams,
        search?: string,
        signal?: AbortSignal
    ): Promise<Page<ContentStatusResponse>> => {

        const res = await contentStatusApi.getAll(
            params,
            search,
            { signal }
        );

        return res.data;
    },
     

    getById: async (
        id: number,
        signal?: AbortSignal
    ): Promise<ContentStatusResponse> => {

        const res = await contentStatusApi.getById(
            id,
            { signal }
        );

        return res.data;
    },

    create: async (
        data: ContentStatusRequest,
        signal?: AbortSignal
    ): Promise<ContentStatusResponse> => {

        const res = await contentStatusApi.create(
            data,
            { signal }
        );

        return res.data;
    },

    update: async (
        id: number,
        data: ContentStatusRequest,
        signal?: AbortSignal
    ): Promise<ContentStatusResponse> => {

        const res = await contentStatusApi.update(
            id,
            data,
            { signal }
        );

        return res.data;
    },

    delete: async (id: number, signal?: AbortSignal): Promise<void> => {
        await contentStatusApi.delete(id, { signal });
    }
}