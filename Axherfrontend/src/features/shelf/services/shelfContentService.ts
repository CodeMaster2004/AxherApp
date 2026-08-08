import { adminShelfContentApi } from "@/core/api/endpoints/AdminShelfContentApi";
import { CreateShelfContent, ShelfContent, UpdateShelfContent } from "@/entities/types";

export const shelfContentService = {

    getAll: async(
        shelfId:number,
        signal?:AbortSignal
    ):Promise<ShelfContent[]> => {

        const res = await adminShelfContentApi.getAll(
            shelfId,
            {
                signal
            }
        );

        return res.data;
    },
    
    addContent: async(
        shelfId: number,
        data: CreateShelfContent,
        signal?: AbortSignal
    ) : Promise<void> => {
        await adminShelfContentApi.addContent(
            shelfId,
            data,
            {
                signal
            }
        );
    },

    updatePosition: async(
        shelfId: number,
        shelfContentId: number,
        data: UpdateShelfContent,
        signal?: AbortSignal
    ) : Promise<void> => {
        await adminShelfContentApi.updatePosition(
            shelfId,
            shelfContentId,
            data,
            {
                signal
            }
        );
    },
    
    delete: async(
        shelfId: number,
        shelfContentId: number,
        signal?: AbortSignal
    ) : Promise<void> => {
        await adminShelfContentApi.delete(
            shelfId,
            shelfContentId,
            {
                signal
            }
        );
    }
    

    
}