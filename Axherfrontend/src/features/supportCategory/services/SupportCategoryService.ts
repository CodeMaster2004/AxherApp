import { AdminSupportCategoryApi } from "@/core/api/endpoints/AdminSupportCategoryApi";
import { Page, PaginationParams, SupportCategoryRequest, SupportCategoryResponse } from "@/entities/types";

export const supportCategoryService = {

    getAll: async (
            params: PaginationParams,
            search?: string,
            signal?: AbortSignal
        ): Promise<Page<SupportCategoryResponse>> => {
            const response = await AdminSupportCategoryApi.getAll(params, search, { signal });
            return response.data;
        },
    
        getById: async (
            supportCategoryId: number,
            signal?: AbortSignal
    
        ): Promise<SupportCategoryResponse> => {
            const response = await AdminSupportCategoryApi.getById(supportCategoryId, { signal });
            return response.data;
        },
    
        create: async (
            data: SupportCategoryRequest,
            signal?: AbortSignal
        ): Promise<SupportCategoryResponse> => {
            const response = await AdminSupportCategoryApi.create(data, { signal });
            return response.data;
        },
    
        update: async (
            supportCategoryId: number,
            data: SupportCategoryRequest,
            signal?: AbortSignal
        ): Promise<SupportCategoryResponse> => {
            const response = await AdminSupportCategoryApi.update(supportCategoryId, data, { signal });
            return response.data;
        },
    
        delete: async (
            supportCategoryId: number,
            signal?: AbortSignal
        ): Promise<void> => {
            await AdminSupportCategoryApi.delete(supportCategoryId, { signal });
        }
}