// entities/types.ts

export interface HeroBanner {
    heroBannerId: number;
    contentId: number;
    contentTitle: string;
    titleOverride?: string;
    descriptionOverride?: string;
    backdropUrl: string;
    priority: number;
    startDate?: string;
    endDate?: string;
    active: boolean;
    createdAt?: string;
    languageId: number;
}


export interface HeroBannerRequest {
    contentId: number;
    titleOverride?: string;
    descriptionOverride?: string;
    backdropUrl?: string;
    priority?: number;
    startDate?: string;
    endDate?: string;
    active?: boolean;
    languageId?: number;
}


export interface HeroBannerResponse {
    heroBannerId: number;
    contentId: number;
    title: string;
    description: string;
    backdropUrl: string;
    priority: number;
    startDate?: string;
    endDate?: string;
    active: boolean;
}

export interface HeroBannerTranslationRequest {
    languageId: number;
    titleOverride: string;
    descriptionOverride: string;
}

export interface HeroBannerTranslationResponse {
    heroBannerId: number;
    languageId: number;
    languageCode: string;
    languageName: string;
    titleOverride: string | null;
    descriptionOverride: string | null;
}

export interface HeroBannerAiTranslationRequest {
    targetLanguageId: number;
}

export interface HeroBannerAiTranslationResponse {
    sourceLanguageId: number;
    targetLanguageId: number;
    sourceTitleOverride: string;
    sourceDescriptionOverride: string;
    translatedTitleOverride: string;
    translatedDescriptionOverride: string;
}