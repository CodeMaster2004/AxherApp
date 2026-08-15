export interface ReportStatusRequest {
    code: string;
    name: string;
    description?: string;
}

export interface ReportStatusResponse {
    reportStatusId: number;
    code: string;
    name: string;
    description?: string;
}