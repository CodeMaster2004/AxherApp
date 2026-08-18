export interface SupportCategoryRequest {
    code: string;
    name: string;
    description?: string;
}

export interface SupportCategoryResponse {
    supportCategoryId: number;
    code: string;
    name: string;
    description?: string;
}