import { ContentType } from "@/entities/types";

export interface PlaybackHistoryRequest {
    contentId: number;
    episodeId?: number;
    watchedSeconds: number;
}

export interface PlaybackHistoryResponse {
    playbackHistoryId: number;
    contentId: number;
    episodeId?: number;
    title: string;
    posterUrl: string;
    watchedSeconds: number;
    progress: number;
    watchedAt: string;
}

export interface ContinueWatching{
    contentId: number;
    title: string;
    backdropUrl: string;
    contentType: ContentType;

    episodeId?: number;
    seasonNumber?: number;
    episodeNumber?: number;
    episodeTitle?: string;

    watchedSeconds: number;
    durationSeconds: number;
    progress: number;
}