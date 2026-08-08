import { ContentType } from "@/entities/types/content.types";

export interface PopularContent {
    contentId: number;
    title: string;
    porterUrl: string;
    watchedSeconds: number;
}

export interface TrendingContent {

    contentId:number;
    title:string;
    posterUrl:string;
    type: ContentType;
    totalViews:number;
    uniqueUsers:number;
    watchedSeconds:number;
    score:number;
}

export interface TopRatedContent {
    contentId:number;
    title:string,
    posterUrl:string;
    type: ContentType;
    averageRating:number;
    totalRatings:number;
    score:number;
}

export interface HeroContent {
    contentId: number;
    title: string;
    description: string;
    backdropUrl: string;
    trailerUrl: string;
    type: ContentType;
    reason: string ;
}
