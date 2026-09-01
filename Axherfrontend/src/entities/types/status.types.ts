export interface ContentStatusRequest {
    code: string;
    name: string;
    description: string;
    languageId: number;
}

export interface ContentStatusResponse {
    contentStatusId: number;
    code: string;
    name: string;
    description?: string;
    languageId: number;
    
}

export interface ContentStatusTranslationRequest {
    languageId: number;
    name: string;
    description: string;
}

export interface ContentStatusTranslationResponse {
    contentStatusId: number;
    languageId: number;
    languageCode: string;
    languageName: string;
    name: string;
    description: string;
}

export interface ContentStatusAiTranslationRequest {
    targetLanguageId: number;
}

export interface ContentStatusAiTranslationResponse {
    sourceLanguageId: number;
    targetLanguageId: number;
    sourceName: string;
    sourceDescription: string;
    translatedName: string;
    translatedDescription: string;
}