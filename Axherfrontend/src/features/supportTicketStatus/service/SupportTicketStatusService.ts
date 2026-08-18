import { AdminSupportTicketStatusApi } from "@/core/api/endpoints/AdminSupportTicketStatusApi";
import { Page, PaginationParams, SupportTicketStatusRequest, SupportTicketStatusResponse } from "@/entities/types";

export const supportTicketStatusService = {
    
    getAll: async (
            params: PaginationParams,
            search?: string,
            signal?: AbortSignal
        ): Promise<Page<SupportTicketStatusResponse>> => {
            const response = await AdminSupportTicketStatusApi.getAll(params, search, { signal });
            return response.data;
        },
    
        getById: async (
            supportTicketStatusId: number,
            signal?: AbortSignal
    
        ): Promise<SupportTicketStatusResponse> => {
            const response = await AdminSupportTicketStatusApi.getById(supportTicketStatusId, { signal });
            return response.data;
        },
    
        create: async (
            data: SupportTicketStatusRequest,
            signal?: AbortSignal
        ): Promise<SupportTicketStatusResponse> => {
            const response = await AdminSupportTicketStatusApi.create(data, { signal });
            return response.data;
        },
    
        update: async (
            supportTicketStatusId: number,
            data: SupportTicketStatusRequest,
            signal?: AbortSignal
        ): Promise<SupportTicketStatusResponse> => {
            const response = await AdminSupportTicketStatusApi.update(supportTicketStatusId, data, { signal });
            return response.data;
        },
    
        delete: async (
            supportTicketStatusId: number,
            signal?: AbortSignal
        ): Promise<void> => {
            await AdminSupportTicketStatusApi.delete(supportTicketStatusId, { signal });
        }

}