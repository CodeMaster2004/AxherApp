export interface SupportTicketStatusRequest {
    code: string;
    name: string;
    description?: string;
}

export interface SupportTicketStatusResponse {
    supportTicketStatusId: number;
    code: string;
    name: string;
    description?: string;
}