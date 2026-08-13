import { searchHistoryApi } from "@/core/api/endpoints/SearchHistoryApi";
import { Page, PaginationParams, SearchHistoryRequest, SearchHistoryResponse } from "@/entities/types";

export const searchHistoryService = {

    getHistory: async (
        params: PaginationParams
    ): Promise<Page<SearchHistoryResponse>> => {
        const response = await searchHistoryApi.getHistory(params);
        return response.data;
    },

    save: async (
        data: SearchHistoryRequest
    ): Promise<SearchHistoryResponse> => {
        const response = await searchHistoryApi.save(data);
        return response.data;
    },

    delete: async (
        searchId: number
    ): Promise<void> => {
        await searchHistoryApi.delete(searchId);
    },

    clear: async (): Promise<void> => {
        await searchHistoryApi.clear();
    }
    
}