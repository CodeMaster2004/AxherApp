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