import { adminShelfApi } from "@/core/api/endpoints/AdminShelfApi";
import { shelfApi } from "@/core/api/endpoints/shelfApi";
import { ContentShelf, CreateShelf, Page, PaginationParams, Shelf, UpdateShelf } from "@/entities/types";

export const shelfService = {

    getAll: async(
        params: PaginationParams,
        search?:string,
        signal?: AbortSignal
    ): Promise<Page<ContentShelf>> => {
        const res = await adminShelfApi.getAll(
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
    ) :Promise<ContentShelf> => {
        const res = await adminShelfApi.getById(
            id,
            {
                signal
            }
        );

        return res.data;
    },

    create: async(
        data: CreateShelf,
        signal?:AbortSignal
    ):Promise<ContentShelf> => {
        const res = await adminShelfApi.create(
            data,
            {
                signal
            }
        );
        return res.data;
    },
    update: async(
        id:number,
        data: UpdateShelf,
        signal?:AbortSignal
    ):Promise<ContentShelf> => {
        const res = await adminShelfApi.update(
            id,
            data,
            {
                signal
            }
        );
        return res.data;
    },

    toggleActive: async(
        id:number,
        signal?:AbortSignal
    ):Promise<ContentShelf> => {
        const res = await adminShelfApi.toggleActive(
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
    ):Promise<void> => {
        await adminShelfApi.delete(
            id,
            {
                signal
            }
        );
    },

    getByTarget: async(
        target: string,
        slug?: string,
        signal?: AbortSignal
    ): Promise<Shelf[]> => {
        const res = await shelfApi.getByTarget(
            target,
            slug,
            {
                signal
            }
        );
    
        return res.data;
    }
}