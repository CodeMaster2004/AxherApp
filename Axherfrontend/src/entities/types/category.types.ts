export interface ContentCategoryRequest {
    name: string;
    description: string;
    languageId: number;
}

export interface ContentCategoryResponse {
    contentCategoryId: number;
    slug: string;
    name: string;
    description?: string;
    languageId: number;
}

export interface ContentCategoryTranslationRequest {
    languageId: number;
    name: string;
    description: string;
}

export interface ContentCategoryTranslationResponse {
    categoryId: number;
    languageId: number;
    languageCode: string;
    languageName: string;
    name: string;
    description: string;
}