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