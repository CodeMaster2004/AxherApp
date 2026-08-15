export enum ProblemReportCategory {
    VIDEO = "VIDEO",
    AUDIO = "AUDIO",
    SUBTITLES = "SUBTITLES",
    PLAYBACK = "PLAYBACK",
    OTHER = "OTHER",
}

export interface ProblemReportRequest {
    category: ProblemReportCategory;
    description: string;
    contentId?: number;
    episodeId?: number;
}

export interface ProblemReportStatusRequest {
    reportStatusId: number;
}

export interface ProblemReportResponse {
    reportId: number;
    category: ProblemReportCategory;
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