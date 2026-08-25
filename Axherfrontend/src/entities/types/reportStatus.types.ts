export interface ReportStatusRequest {
    code: string;
    name: string;
    description: string;
    languageId: number;
}

export interface ReportStatusResponse {
    reportStatusId: number;
    code: string;
    name: string;
    description?: string;
    languageId: number;
}

export interface ReportStatusTranslationRequest {
    languageId: number;
    name: string;
    description: string;
}

export interface ReportStatusTranslationResponse {
    reportStatusId: number;
    languageId: number;
    languageCode: string;
    languageName: string;
    name: string;
    description: string;
}