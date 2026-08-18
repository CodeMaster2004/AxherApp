import axiosClient from "@/core/api/axiosClient";
import { Page, PaginationParams, SupportTicketStatusRequest, SupportTicketStatusResponse } from "@/entities/types";
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
        )
}