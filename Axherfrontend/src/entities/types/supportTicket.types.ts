export interface SupportTicketResponse {
    supportTicketId: number;
    subject: string;

    supportCategoryId: number;
    supportCategoryCode?: string;
    supportCategoryName: string;

    supportTicketStatusId: number;
    supportTicketStatusCode: string;
    supportTicketStatusName: string;

    userId: number;

    subscriptionId?: number | null;
    subscriptionPaymentId?: number | null;

    createdAt: string;
    updatedAt: string;
    resolvedAt?: string | null;
    closedAt?: string | null;
}

export interface SupportTicketRequest {
    subject: string;
    supportCategoryId: number;
    description: string;
    subscriptionId?: number | null;
    subscriptionPaymentId?: number | null;
}

export interface SupportTicketFilters {
    search?: string;
    statusCode?: string;
    supportCategoryId?: number;
    userId?: number;
    createdAtFrom?: string;
    createdAtTo?: string;
}

export interface TicketStatusRequest {
    supportTicketStatusId: number;
}