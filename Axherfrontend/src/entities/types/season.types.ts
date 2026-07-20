import { CreateEpisode, EpisodeDetail, UpdateEpisode } from "@/entities/types/episode.types";

export interface SeasonDetail{
    seasonId: number;
    seasonNumber: number;
    title: string;
    description?: string;
    releaseDate: string;

    //Datos aninados para episodios
    episodes: EpisodeDetail[];
}

export interface CreateSeason{
    seasonNumber: number;
    title: string;
    description?: string;
    releaseDate?: string;

    //Al crear temporada sola(sin serie), se ignoran los episodios
    episodes?: CreateEpisode[];
}

export interface UpdateSeason{
    seasonId: number;
    seasonNumber?: number;
    title?: string;
    description?: string;
    releaseDate?: string;

    episodes?: UpdateEpisode[];
}