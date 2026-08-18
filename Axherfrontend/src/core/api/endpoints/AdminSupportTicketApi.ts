import axiosClient from "@/core/api/axiosClient";
import { Page, PaginationParams, SupportTicketFilters, SupportTicketResponse, TicketStatusRequest } from "@/entities/types";
import { AxiosRequestConfig } from "axios";

export const adminSupportTicketApi = {

    getAll: (
        params: PaginationParams & SupportTicketFilters,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.get<Page<SupportTicketResponse>>(
            "/admin/support/tickets",
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
            `/admin/support/tickets/${ticketId}`,
            config
        ),

    updateStatus: (
        ticketId: number,
        data: TicketStatusRequest,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.patch<SupportTicketResponse>(
            `/admin/support/tickets/${ticketId}/status`,
            data,
            config
        )
}