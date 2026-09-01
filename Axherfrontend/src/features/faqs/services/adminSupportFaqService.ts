import { adminSupportFaqApi } from "@/core/api/endpoints/adminSupportFaqApi";
import { Page, PaginationParams } from "@/entities/types";
import { SupportFaqFilters, SupportFaqRequest, SupportFaqResponse } from "@/entities/types/supportFaq.types";

export const adminSupportFaqService = {

    getAll: async (
        params: PaginationParams & SupportFaqFilters,
        signal?: AbortSignal
    ): Promise<Page<SupportFaqResponse>> => {

        const response =
            await adminSupportFaqApi.getAll(
                params,
                { signal }
            );

        return response.data;
    },

    getById: async (
        id: number,
        signal?: AbortSignal
    ): Promise<SupportFaqResponse> => {

        const response =
            await adminSupportFaqApi.getById(
                id,
                { signal }
            );

        return response.data;
    },

    create: async (
        data: SupportFaqRequest,
        signal?: AbortSignal
    ): Promise<SupportFaqResponse> => {

        const response =
            await adminSupportFaqApi.create(
                data,
                { signal }
            );

        return response.data;
    },

    update: async (
        id: number,
        data: Partial<SupportFaqRequest>,
        signal?: AbortSignal
    ): Promise<SupportFaqResponse> => {

        const response =
            await adminSupportFaqApi.update(
                id,
                data,
                { signal }
            );

        return response.data;
    },

    toggleActive: async (
        id: number,
        signal?: AbortSignal
    ): Promise<SupportFaqResponse> => {

        const response =
            await adminSupportFaqApi.toggleActive(
                id,
                { signal }
            );

        return response.data;
    },

    delete: async (
        id: number,
        signal?: AbortSignal
    ): Promise<void> => {

        await adminSupportFaqApi.delete(
            id,
            { signal }
        );
    },
};