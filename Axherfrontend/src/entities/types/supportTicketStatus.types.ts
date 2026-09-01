export interface SupportTicketStatusRequest {
    code: string;
    name: string;
    description: string;
    languageId: number;
}

export interface SupportTicketStatusResponse {
    supportTicketStatusId: number;
    code: string;
    name: string;
    description?: string;
    languageId: number;
}

export interface SupportTicketStatusTranslationResponse {
    supportTicketStatusId: number;
    languageId: number;
    languageCode: string;
    languageName: string;
    name: string;
    description: string | null;
}


export interface SupportTicketStatusTranslationRequest {
    languageId: number;
    name: string;
    description: string;
}

export interface SupportTicketStatusAiTranslationRequest {
    targetLanguageId: number;
}

export interface SupportTicketStatusAiTranslationResponse {
    sourceLanguageId: number;
    targetLanguageId: number;
    sourceName: string;
    sourceDescription: string;
    translatedName: string;
    translatedDescription: string;
}