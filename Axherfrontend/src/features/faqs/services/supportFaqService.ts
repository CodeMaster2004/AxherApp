import { supportFaqApi } from "@/core/api/endpoints/supportFaqApi";
import { Page, PaginationParams } from "@/entities/types";
import { SupportFaqFilters, SupportFaqResponse } from "@/entities/types/supportFaq.types";
import { Signal } from "lucide-react";

export const supportFaqService = {

    getAll: async (
        params: PaginationParams & SupportFaqFilters,
        signal?: AbortSignal
    ): Promise<Page<SupportFaqResponse>> => {

        const response =
            await supportFaqApi.getAll(params, {signal});

        return response.data;
    },

    getById: async (
        id: number
    ): Promise<SupportFaqResponse> => {

        const response =
            await supportFaqApi.getById(id);

        return response.data;
    },
};