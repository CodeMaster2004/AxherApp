import axiosClient from "@/core/api/axiosClient";
import { Page, PaginationParams, SupportTicketStatusAiTranslationRequest, SupportTicketStatusAiTranslationResponse, SupportTicketStatusRequest, SupportTicketStatusResponse, SupportTicketStatusTranslationRequest, SupportTicketStatusTranslationResponse } from "@/entities/types";
import { AxiosRequestConfig } from "axios";

export const AdminSupportTicketStatusApi = {

    getAll: (
        params: PaginationParams,
        search?: string,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.get<Page<SupportTicketStatusResponse>>(
            "/admin/support/ticket-status",
            {
                params: {
                    ...params,
                    search
                },
                ...config
            }
        ),

    getById: (
        supportTicketStatusId: number,
        config?: AxiosRequestConfig
    )=>
        axiosClient.get<SupportTicketStatusResponse>(
            `/admin/support/ticket-status/${supportTicketStatusId}`,
            config
        ),

    create: (
        data: SupportTicketStatusRequest,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.post<SupportTicketStatusResponse>(
            "/admin/support/ticket-status",
            data,
            config
        ),

    update: (
        supportTicketStatusId: number,
        data: SupportTicketStatusRequest,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.patch<SupportTicketStatusResponse>(
            `/admin/support/ticket-status/${supportTicketStatusId}`,
            data,
            config
        ),
    
    delete: (
        supportTicketStatusId: number,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.delete(
            `/admin/support/ticket-status/${supportTicketStatusId}`,
            config
        ),

    translations: {

        getAll: (
            statusId: number,
            config?: object
        ) =>
            axiosClient.get<SupportTicketStatusTranslationResponse[]>(
                `/admin/support-ticket-statuses/${statusId}/translations`,
                config
            ),

        create: (
            statusId: number,
            data: SupportTicketStatusTranslationRequest,
            config?: AxiosRequestConfig
        ) =>
            axiosClient.post<SupportTicketStatusTranslationResponse>(
                `/admin/support-ticket-statuses/${statusId}/translations`,
                data,
                config
            ),

        update: (
            statusId: number,
            languageId: number,
            data: SupportTicketStatusTranslationRequest,
            config?: AxiosRequestConfig
        ) =>
            axiosClient.patch<SupportTicketStatusTranslationResponse>(
                `/admin/support-ticket-statuses/${statusId}/translations/${languageId}`,
                data,
                config
            ),

        translateWithAi: (
            statusId: number,
            sourceLanguageId: number,
            data: SupportTicketStatusAiTranslationRequest,
            config?: AxiosRequestConfig
        ) =>
            axiosClient.post<SupportTicketStatusAiTranslationResponse>(
                `/admin/support-ticket-statuses/${statusId}/translations/${sourceLanguageId}/translate`,
                data,
                config
            ),

        delete: (
            statusId: number,
            languageId: number,
            config?: object
        ) =>
            axiosClient.delete(
                `/admin/support-ticket-statuses/${statusId}/translations/${languageId}`,
                config
            ),

    },
}