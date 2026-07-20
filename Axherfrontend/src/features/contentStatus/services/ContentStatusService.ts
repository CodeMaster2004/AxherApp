import { contentStatusApi } from "@/core/api/endpoints/ContentStatusApi";
import { ContentStatus, Page, PaginationParams } from "@/entities/types";

export const contentStatusService ={

    getAll: async (params: PaginationParams, search?: string, signal?: AbortSignal): Promise<Page<ContentStatus>> =>{
        const res = await contentStatusApi.getAll(params, search, { signal });
        return res.data;
    },
     

    getById: async(id: number, signal?: AbortSignal): Promise<ContentStatus> =>{
        const res = await contentStatusApi.getById(id, { signal });
        return res.data;
    },

    create: async (data: Omit<ContentStatus, "contentStatusId">, signal?: AbortSignal): Promise<ContentStatus> => {
        const res = await contentStatusApi.create(data, { signal });
        return res.data;

    },

    update: async (id: number, data: Partial<ContentStatus>, signal?: AbortSignal): Promise<ContentStatus> => {
        const res = await contentStatusApi.update(id, data, { signal });
        return res.data;
    },

    delete: async (id: number, signal?: AbortSignal): Promise<void> => {
        await contentStatusApi.delete(id, { signal });
    }
}