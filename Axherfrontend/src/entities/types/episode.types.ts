import { ContentStatusResponse } from "@/entities/types/content.types";

export interface EpisodeDetail{
    episodeId: number;
    episodeNumber: number;
    title: string;
    description?: string;
    durationSeconds?: number;
    thumbnailUrl: string;
    episodeUrl: string;
    releaseDate?: string;
    status: ContentStatusResponse;

    seasonNumber: number;
    seriesTitle: string;

}

export interface CreateEpisode{
    episodeNumber: number;
    title: string;
    description?: string;
    thumbnailFile: File;
    episodeFile: File;
    releaseDate?: string;
    seasonId?: number;
}

export interface UpdateEpisode{
    episodeId: number;
    episodeNumber?: number;
    title?: string;
    description?: string;
    thumbnailFile?: File;
    episodeFile?: File;
    releaseDate?: string;
    statusId?: number;
}

export interface UpcomingEpisode{
    episodeId: number;
    episodeNumber: number;
    title: string;
    description: string;
    durationSeconds: number;
    thumbnailUrl: string;
    releaseDate: string;
    seasonNumber: number;
    seriesTitle: string;

}

export interface EpisodeTranslation {
    episodeId: number;
    languageId: number;
    languageCode: string;
    languageName: string;
    title: string;
    description: string;
}

export interface EpisodeTranslationRequest {
    languageId: number;
    title: string;
    description: string;
}