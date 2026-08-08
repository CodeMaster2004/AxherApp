import { contentCategoriesApi } from "@/core/api/endpoints/ContentCategoriesApi";
import { Category, ContentCategories, Page, PaginationParams } from "@/entities/types";

export const contentCategoriesService = {

    getAll: async(params: PaginationParams, search?: string, signal?: AbortSignal): Promise<Page<ContentCategories>> =>{
        const res = await contentCategoriesApi.getAll(params, search, { signal });
        return res.data;
    },
    
     
    getById: async(id: number, signal?: AbortSignal): Promise<ContentCategories> =>{
        const res = await contentCategoriesApi.getById(id, { signal });
        return res.data;
    },

    getBySlug: async(slug: string, signal?: AbortSignal): Promise<Category> => {
        const res = await contentCategoriesApi.geBySlug(slug, { signal });
        return res.data;
    },


    create: async(data: Omit<ContentCategories, "contentCategoryId">, signal?: AbortSignal): Promise<ContentCategories> =>{
        const res = await contentCategoriesApi.create(data, { signal });
        return res.data;
    },

    update: async(id: number, data: Partial<ContentCategories>, signal?: AbortSignal): Promise<ContentCategories> =>{
        const res = await contentCategoriesApi.update(id, data, { signal });
        return res.data;
    },

    delete: async(id: number, signal?: AbortSignal): Promise<void> =>{
        await contentCategoriesApi.delete(id, { signal });
    }
  
};