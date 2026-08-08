import { SeasonDetail, StatusUpdate } from "@/entities/types";
import { seasonsService } from "@/features/seasons/services/SeasonsService";
import { AxiosProgressEvent } from "axios";
import { useCallback, useState } from "react";


type Options = {
    onSuccess?: (result?: SeasonDetail) => void;
    onError?: (error: unknown) => void;
}

export const useSeasonsActions = (seriesId: number, options?: Options) => {
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState<number | null>(null);
    const [error, setError] = useState<unknown | null>(null);
    const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);

    const addSeason = useCallback(
        async (formData: FormData, onUploadProgress?: (progressEvent: AxiosProgressEvent) => void) => {
            setSaving(true);
            setError(null);

            try{
                const created = await seasonsService.create(seriesId, formData, onUploadProgress);
                options?.onSuccess?.(created);
                return created;
            }catch(err){
                setError(err);
                options?.onError?.(err);
                throw err;
            }finally{
                setSaving(false);
            }
        },
        [seriesId, options]
    );

    const editSeason = useCallback(
        async (seasonId: number, formData: FormData, onUploadProgress?: (progressEvent: AxiosProgressEvent) => void) => {
            setSaving(true);
            setError(null);

            try{
                const updated = await seasonsService.update(seriesId, seasonId, formData, onUploadProgress);
                options?.onSuccess?.(updated);
                return updated;
            }catch(err){
                setError(err);
                options?.onError?.(err);
                throw err;
            }finally{
                setSaving(false);
            }
        },
        [seriesId, options]
    );

    const updateSeasonStatus = useCallback(
        async (seasonId: number, statusUpdate: StatusUpdate) => {

            setUpdatingStatus(seasonId);
            setError(null);

            try{
                const updated = await seasonsService.updateStatus(seriesId, seasonId, statusUpdate);
                options?.onSuccess?.(updated);
                return updated;
            }catch(err){
                setError(err);
                options?.onError?.(err);
                throw err;
            }finally{
                setUpdatingStatus(null);
            }
        },
        [seriesId, options]
    );

    const removeSeason = useCallback(
        async (seasonId: number) => {
            setDeleting(seasonId);
            setError(null);

            try{
                await seasonsService.delete(seriesId, seasonId);
                options?.onSuccess?.();
            }catch(err){
                setError(err);
                options?.onError?.(err);
                throw err;
            }finally{
                setDeleting(null);
            }
        },
        [seriesId, options]
    );

    return{
        saving,
        deleting,
        error,
        updatingStatus,
        addSeason,
        editSeason,
        updateSeasonStatus,
        removeSeason,
    };
};