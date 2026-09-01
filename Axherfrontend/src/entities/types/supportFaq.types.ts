
export interface SupportFaqRequest {
    supportCategoryId: number,
    displayOrder?: number,
    active?: boolean,
    question: string,
    answer: string
    languageId: number
}

export interface SupportFaqResponse {
    supportFaqId: number,
    supportCategoryId: number,
    displayOrder: number,
    active: boolean,
    question: string,
    answer: string,
    languageId: number
}

export interface SupportFaqFilters {
    search?: string;
    supportCategoryId?: number;
    active?: boolean;
}

export interface SupportFaqTranslationRequest {
    languageId: number,
    question: string,
    answer: string
}

export interface SupportFaqTranslationResponse {
    supportFaqId: number,
    languageId: number,
    languageCode: string,
    languageName: string,
    question: string,
    answer: string
}

// ============================
// AI TRANSLATION
// ============================

export interface SupportFaqAiTranslationRequest {
    targetLanguageId: number
}

export interface SupportFaqAiTranslationResponse {
    sourceLanguageId: number,
    targetLanguageId: number,
    sourceQuestion: string,
    sourceAnswer: string,
    translatedQuestion: string,
    translatedAnswer: string
}