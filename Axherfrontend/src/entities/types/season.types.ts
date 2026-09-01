import { ContentStatusResponse } from "@/entities/types";
import { CreateEpisode, EpisodeDetail, UpdateEpisode } from "@/entities/types/episode.types";

export interface SeasonDetail{
    seasonId: number;
    seasonNumber: number;
    title: string;
    description?: string;
    releaseDate: string;
    status: ContentStatusResponse;
    episodeCount: number;

    //Datos aninados para episodios
    episodes: EpisodeDetail[];
}

export interface CreateSeason{
    seasonNumber: number;
    title: string;
    description?: string;
    releaseDate?: string;
    statusId?: number;

    //Al crear temporada sola(sin serie), se ignoran los episodios
    episodes?: CreateEpisode[];
}

export interface UpdateSeason{
    seasonId: number;
    seasonNumber?: number;
    title?: string;
    description?: string;
    releaseDate?: string;
    statusId?: number;

    episodes?: UpdateEpisode[];
}

export interface UpcomingSeason{
    seasonId: number;
    seasonNumber: number;
    title: string;
    description?: string;
    releaseDate: string;
}

export interface SeasonTranslation {
    seasonId: number;
    languageId: number;
    languageCode: string;
    languageName: string;
    title: string;
    description: string;
}

export interface SeasonTranslationRequest {
    languageId: number;
    title: string;
    description: string;
}

export interface SeasonAiTranslationRequest {
    targetLanguageId: number;
}

export interface SeasonAiTranslationResponse {
    sourceLanguageId: number;
    targetLanguageId: number;
    sourceTitle: string;
    sourceDescription: string;
    translatedTitle: string;
    translatedDescription: string;
}