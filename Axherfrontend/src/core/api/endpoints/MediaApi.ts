import { API_URL } from "@/core/api/axiosClient";

export const mediaApi = {

    movieStreamUrl: (contentId: number) =>
        `${API_URL}/media/videos/${contentId}/stream`,

    episodeStreamUrl: (episodeId: number) =>
        `${API_URL}/media/episodes/${episodeId}/stream`,
}