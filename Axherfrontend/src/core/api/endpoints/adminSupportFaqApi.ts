import axiosClient from "@/core/api/axiosClient";
import { Page, PaginationParams } from "@/entities/types";
import { SupportFaqAiTranslationRequest, SupportFaqAiTranslationResponse, SupportFaqFilters, SupportFaqRequest, SupportFaqResponse, SupportFaqTranslationRequest, SupportFaqTranslationResponse } from "@/entities/types/supportFaq.types";
import { AxiosRequestConfig } from "axios";

export const adminSupportFaqApi = {

    getAll: (
        params: PaginationParams & SupportFaqFilters,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.get<Page<SupportFaqResponse>>(
            "/admin/support/faq",
            {
                params,
                ...config
            }
        ),

    getById: (
        id: number,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.get<SupportFaqResponse>(
            `/admin/support/faq/${id}`,
            config
        ),

    create: (
        data: SupportFaqRequest,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.post<SupportFaqResponse>(
            "/admin/support/faq",
            data,
            config
        ),
    
    update: (
        id: number,
        data: Partial<SupportFaqRequest>,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.patch<SupportFaqResponse>(
            `/admin/support/faq/${id}`,
            data,
            config
        ),

    toggleActive: (
        id: number,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.patch<SupportFaqResponse>(
            `/admin/support/faq/${id}/toggle`,
            {},
            config
        ),

    delete: (
        id: number,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.delete(
            `/admin/support/faq/${id}`,
            config
        ),

    translations: {

        getAll: (
            faqId: number,
            config?: AxiosRequestConfig
        ) =>
            axiosClient.get<SupportFaqTranslationResponse[]>(
                `/admin/support/faq/${faqId}/translations`,
                config
            ),

        create: (
            faqId: number,
            data: SupportFaqTranslationRequest,
            config?: AxiosRequestConfig
        ) =>
            axiosClient.post<SupportFaqTranslationResponse>(
                `/admin/support/faq/${faqId}/translations`,
                data,
                config
            ),

        update: (
            faqId: number,
            languageId: number,
            data: SupportFaqTranslationRequest,
            config?: AxiosRequestConfig
        ) =>
            axiosClient.patch<SupportFaqTranslationResponse>(
                `/admin/support/faq/${faqId}/translations/${languageId}`,
                data,
                config
            ),

        translateWithAi: (
            faqId: number,
            sourceLanguageId: number,
            data: SupportFaqAiTranslationRequest,
            config?: AxiosRequestConfig
        ) =>
            axiosClient.post<SupportFaqAiTranslationResponse>(
                `/admin/support/faq/${faqId}/translations/${sourceLanguageId}/translate`,
                data,
                config
            ),

        delete: (
            faqId: number,
            languageId: number,
            config?: AxiosRequestConfig
        ) =>
            axiosClient.delete(
                `/admin/support/faq/${faqId}/translations/${languageId}`,
                config
            )
    }
}