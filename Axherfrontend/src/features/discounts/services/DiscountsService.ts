import { discountsApi } from "@/core/api/endpoints/DiscountsApi";
import { Discounts, Page, PaginationParams } from "@/entities/types";

export const discountsService = {

    getAll: async(params: PaginationParams, search?: string, signal?: AbortSignal): Promise <Page<Discounts>> => {
        const res = await discountsApi.getAll(params, search, { signal });
        return res.data;
    },

    getById: async(id: number, signal?: AbortSignal): Promise<Discounts> =>{
        const res = await discountsApi.getById(id , { signal });
        return res.data;
    },

    create: async(data: Omit<Discounts, "discountId">, signal?: AbortSignal): Promise<Discounts> => {
        const res = await discountsApi.create(data, { signal });
        return res.data;
    },

    update: async(id: number, data: Partial<Discounts>, signal?: AbortSignal): Promise<Discounts> => {
        const res = await discountsApi.update(id, data, { signal });
        return res.data;
    },
    
    delete: async(id: number, signal?: AbortSignal): Promise<void> => {
        await discountsApi.delete(id, { signal });
    }
}