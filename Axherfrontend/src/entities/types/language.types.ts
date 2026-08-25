export interface LanguageResponse {
    languageId: number;
    code: string;
    name: string;
    nativeName: string;
    active: boolean;
}

export interface LanguageRequest {
    code: string;
    name: string;
    nativeName: string;
    active?: boolean;
}