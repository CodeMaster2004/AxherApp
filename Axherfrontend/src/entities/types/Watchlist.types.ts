import { ContentType } from "@/entities/types";

export interface WatchlistRequest {
    contentId: number;
}

export interface WatchlistResponse {
    watchlistId: number;
    contentId: number;
    title: string;
    posterUrl: string;
    type: ContentType;
    addedAt: string;
}