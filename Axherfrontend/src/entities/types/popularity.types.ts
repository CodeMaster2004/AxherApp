import { ContentType } from "@/entities/types/content.types";

export interface PopularContent {
    contentId: number;
    title: string;
    porterUrl: string;
    watchedSeconds: number;
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
