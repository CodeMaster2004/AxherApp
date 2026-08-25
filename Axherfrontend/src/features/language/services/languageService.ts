import { AdminLanguageApi } from "@/core/api/endpoints/AdminLanguageApi";
import { LanguageApi } from "@/core/api/endpoints/LanguageApi";
import {
    LanguageRequest,
    LanguageResponse,
    Page,
    PaginationParams
} from "@/entities/types";

export const languageService = {

    getAll: async (
        params: PaginationParams,
        search?: string,
        signal?: AbortSignal
    ): Promise<Page<LanguageResponse>> => {

        const response = await AdminLanguageApi.getAll(
            params,
            search,
            { signal }
        );

        return response.data;
    },

    getById: async (
        languageId: number,
        signal?: AbortSignal
    ): Promise<LanguageResponse> => {

        const response = await AdminLanguageApi.getById(
            languageId,
            { signal }
        );

        return response.data;
    },

    getActive: async (
        signal?: AbortSignal
    ): Promise<LanguageResponse[]> => {

        const response = await LanguageApi.getActive({
            signal
        });

        return response.data;
    },

    create: async (
        data: LanguageRequest,
        signal?: AbortSignal
    ): Promise<LanguageResponse> => {

        const response = await AdminLanguageApi.create(
            data,
            { signal }
        );

        return response.data;
    },

    update: async (
        languageId: number,
        data: LanguageRequest,
        signal?: AbortSignal
    ): Promise<LanguageResponse> => {

        const response = await AdminLanguageApi.update(
            languageId,
            data,
            { signal }
        );

        return response.data;
    },

    delete: async (
        languageId: number,
        signal?: AbortSignal
    ): Promise<void> => {

        await AdminLanguageApi.delete(
            languageId,
            { signal }
        );
    }
};