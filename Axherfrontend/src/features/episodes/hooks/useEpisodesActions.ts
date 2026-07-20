import { EpisodeDetail } from "@/entities/types";
import { episodesService } from "@/features/episodes/services/EpisodesService";
import { AxiosProgressEvent } from "axios";
import { useCallback, useState } from "react";

type Options = {
    onSuccess?: (result?: EpisodeDetail) => void;
    onError?: (error: unknown) => void;
}

export const useEpisodesActions = (seasonId: number, options?: Options) => {
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState<number | null>(null);
    const [error, setError] = useState<unknown | null>(null);

    const addEpisode = useCallback(
        async (formData: FormData, onUploadProgress?: (progressEvent: AxiosProgressEvent) => void) => {
            setSaving(true);
            setError(null);

            try{
                const created = await episodesService.create(seasonId, formData, onUploadProgress);
                options?.onSuccess?.(created);
                return created;
            } catch(err){
                setError(err);
                options?.onError?.(err);
                throw err;
            }finally{
                setSaving(false);
            }
        },
        [seasonId, options]
    );

    const editEpisode = useCallback(
        async (episodeId: number, formData: FormData, onUploadProgress?: (progressEvent: AxiosProgressEvent) => void) => {
            setSaving(true);
            setError(null);

            try {
                const updated = await episodesService.update(seasonId, episodeId, formData, onUploadProgress);
                options?.onSuccess?.(updated);
                return updated;
            } catch(err){
                setError(err);
                options?.onError?.(err);
                throw err;
            }finally{
                setSaving(false);
            }
        },
        [seasonId, options]
    );

    const removeEpisode = useCallback(
        async (episodeId: number) => {
            setDeleting(episodeId);
            setError(null);

            try {
                await episodesService.delete(seasonId, episodeId);
                options?.onSuccess?.();
            }catch(err){
                setError(err);
                options?.onError?.(err);
                throw err;
            }finally{
                setDeleting(null);
            }
        },
        [seasonId, options]
    );

    return {
        saving,
        deleting,
        error,
        addEpisode,
        editEpisode,
        removeEpisode
    }
    
}