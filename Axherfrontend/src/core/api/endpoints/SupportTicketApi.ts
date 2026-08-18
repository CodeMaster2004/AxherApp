import axiosClient from "@/core/api/axiosClient";
import { Page, PaginationParams, SupportTicketRequest, SupportTicketResponse } from "@/entities/types";
import { AxiosRequestConfig } from "axios";

export const supportTicketApi = {
    
    getAll: (
        params: PaginationParams,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.get<Page<SupportTicketResponse>>(
            "/support/tickets",
            {
                params,
                ...config
            }
        ),

    getById: (
        ticketId: number,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.get<SupportTicketResponse>(
            `/support/tickets/${ticketId}`,
            config
        ),

    create: (
        data: SupportTicketRequest,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.post<SupportTicketResponse>(
            "/support/tickets",
            data,
            config
        )
}