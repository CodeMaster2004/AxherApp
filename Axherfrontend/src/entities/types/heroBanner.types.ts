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