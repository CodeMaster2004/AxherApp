import { mediaApi } from "@/core/api/endpoints/MediaApi";

export const mediaService = {
    getMoviesStreamUrl(contentId: number){
        return mediaApi.movieStreamUrl(contentId);
    },

    getEpisodesStreamUrl(episodeId: number){
        return mediaApi.episodeStreamUrl(episodeId);
    },
};