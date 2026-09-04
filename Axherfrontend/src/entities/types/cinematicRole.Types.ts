export interface CinematicRoleRequest {
    code: string;
    name: string;
    description: string;
    languageId: number;
}

export interface CinematicRoleResponse {
    cinematicRoleId: number;
    code: string;
    name: string;
    description?: string;
    languageId: number;
}

export interface CinematicRoleTranslationRequest {
    languageId: number;
    name: string;
    description: string;
}

export interface CinematicRoleTranslationResponse {
    cinematicRoleId: number;
    languageId: number;
    languageCode: string;
    languageName: string;
    name: string;
    description?: string;
}

export interface CinematicRoleAiTranslationRequest {
    targetLanguageId: number;
}

export interface CinematicRoleAiTranslationResponse {
    sourceLanguageId: number;
    targetLanguageId: number;
    sourceName: string;
    sourceDescription: string;
    translatedName: string;
    translatedDescription: string;
}