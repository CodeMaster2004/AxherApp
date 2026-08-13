import axiosClient from "@/core/api/axiosClient";
import { Page, PaginationParams, SearchHistoryRequest, SearchHistoryResponse } from "@/entities/types";
import { AxiosRequestConfig } from "axios";

export const searchHistoryApi = {

    getHistory: (
        params: PaginationParams,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.get<Page<SearchHistoryResponse>>(
            "/search-history",
            {
                params,
                ...config
            }
        ),

    save: (
        data: SearchHistoryRequest,
        config?: AxiosRequestConfig
    ) => 
        axiosClient.post<SearchHistoryResponse>(
            "/search-history",
            data,
            config
        ),

    delete: (
        searchId: number,
        config?: AxiosRequestConfig
    ) => 
        axiosClient.delete<SearchHistoryResponse>(
            `/search-history/${searchId}`,
            config
        ),

    clear: (
        config?: AxiosRequestConfig
    ) => 
        axiosClient.delete(
            "/search-history",
            config
        )
    
}