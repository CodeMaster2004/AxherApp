import axiosClient from "@/core/api/axiosClient";
import { CreateShelfContent, ShelfContent, UpdateShelfContent } from "@/entities/types/shelf.types";
import { AxiosRequestConfig } from "axios";

export const adminShelfContentApi = {

    getAll: (
        shelfId: number,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.get<ShelfContent[]>(
            `/admin/shelves/${shelfId}/contents`,
            config
        ),
        
    addContent: (
        shelfId: number,
        data: CreateShelfContent,
        config?: AxiosRequestConfig
    ) => 
        axiosClient.post<CreateShelfContent>(
            `/admin/shelves/${shelfId}/contents`,
            data,
            config
        ),

    updatePosition: (
        shelfId: number,
        shelfContentId: number,
        data:UpdateShelfContent,
        config?: AxiosRequestConfig
    ) => 
        axiosClient.patch<UpdateShelfContent>(
            `/admin/shelves/${shelfId}/contents/${shelfContentId}`,
            data,
            config
        ),

    delete: (
        shelfId: number,
        shelfContentId: number,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.delete(
            `/admin/shelves/${shelfId}/contents/${shelfContentId}`,
            config
    )
}