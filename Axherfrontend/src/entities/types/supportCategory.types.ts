export interface SupportCategoryRequest {
    code: string;
    name: string;
    description: string;
    languageId: number;
}

export interface SupportCategoryResponse {
    supportCategoryId: number;
    code: string;
    name: string;
    description?: string;
    languageId: number;
}

export interface SupportCategoryTranslationResponse {
    supportCategoryId: number;
    languageId: number;
    languageCode: string;
    languageName: string;
    name: string;
    description: string | null;
}

export interface SupportCategoryTranslationRequest {
    languageId: number;
    name: string;
    description: string;
}
