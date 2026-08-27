
export interface ProblemReportRequest {
    reportCategoryId: number;
    description: string;
    contentId?: number;
    episodeId?: number;
}

export interface ProblemReportStatusRequest {
    reportStatusId: number;
}

export interface ProblemReportResponse {
    reportId: number;

    reportCategoryId: number;
    reportCategoryCode: string;
    reportCategoryName: string;
    
    description: string;

    contentId?: number;
    episodeId?: number;

    reportStatusId: number;
    reportStatusCode: string;
    reportStatusName: string;

    reportedAt: string;
    resolvedAt?: string | null;
}

export interface ProblemReportFilters {
    search?: string;
    statusCode?: string;
    category?: string;
    userId?: number;
    contentId?: number;
    episodeId?: number;
    reportedAtFrom?: string;
    reportedAtTo?: string;
}