import axiosClient from "@/core/api/axiosClient";
import { SupportMessageRequest, SupportMessageResponse } from "@/entities/types";
import { AxiosRequestConfig } from "axios";

export const supportMessageApi = {
    getAllByTicketId: (
        ticketId: number,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.get<SupportMessageResponse[]>(
            `/support/tickets/${ticketId}/messages`,
            config
        ),

    sendMessage: (
        ticketId: number,
        data: SupportMessageRequest,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.post<SupportMessageResponse>(
            `/support/tickets/${ticketId}/messages`,
            data,
            config
        )
}