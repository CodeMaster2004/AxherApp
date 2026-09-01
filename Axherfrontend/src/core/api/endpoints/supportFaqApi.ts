import axiosClient from "@/core/api/axiosClient";
import { Page, PaginationParams } from "@/entities/types";
import { SupportFaqFilters, SupportFaqResponse } from "@/entities/types/supportFaq.types";
import { AxiosRequestConfig } from "axios";

export const supportFaqApi = {

    getAll: (
        params: PaginationParams & SupportFaqFilters,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.get<Page<SupportFaqResponse>>(
            "/support/faq",
            {
                params,
                ...config
            }
        ),

    getById: (
        id: number
    ) =>
        axiosClient.get<SupportFaqResponse>(
            `/support/faq/${id}`
        )
}