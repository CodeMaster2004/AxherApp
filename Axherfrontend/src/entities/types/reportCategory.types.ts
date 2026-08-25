export interface ReportCategoryRequest {
    code: string;
    name: string;
    description: string;
    languageId: number;
}

export interface ReportCategoryResponse {
    reportCategoryId: number;
    code: string;
    name: string;
    description: string;
    languageId: number;
}

export interface ReportCategoryTranslationResponse {
    reportCategoryId: number;
    languageId: number;
    languageCode: string;
    languageName: string;
    name: string;
    description?: string;
}

export interface ReportCategoryTranslationRequest {
    languageId: number;
    name: string;
    description: string;
}