export interface EpisodeDetail{
    episodeId: number;
    episodeNumber: number;
    title: string;
    description?: string;
    durationSeconds?: number;
    thumbnailUrl: string;
    episodeUrl: string;
    releaseDate?: string;

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
}

export interface UpdateEpisode{
    episodeId: number;
    episodeNumber?: number;
    title?: string;
    description?: string;
    thumbnailFile?: File;
    episodeFile?: File;
    releaseDate?: string;
}