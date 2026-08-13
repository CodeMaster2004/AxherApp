import axiosClient from "@/core/api/axiosClient";
import { Shelf } from "@/entities/types";
import { AxiosRequestConfig } from "axios";

export const shelfApi = {

    getByTarget: (
        target:string,
        slug?:string,
        config?:AxiosRequestConfig
    )=>
    axiosClient.get<Shelf[]>(
        "/shelves",
        {
            params:{
                target,
                slug
            },
            ...config
        }
    ),

    getById: (
        shelfId:number,
        config?:AxiosRequestConfig
    )=>
    axiosClient.get<Shelf>(
        `/shelves/${shelfId}`,
        config
    )
}