"use client";

import { ContinueWatching } from "@/entities/types";
import { playbackHistoryService } from "@/features/playbackHistory/services/PlaybackHistoryService";
import { useCallback, useEffect, useState } from "react";

export const useContinueWatching = () => {

    const [continueWatching,setContinueWatching] = useState<ContinueWatching[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<unknown | null>(null);


    const fetchContinueWatching = useCallback(async(signal?: AbortSignal) => {

        setLoading(true);
        setError(null);

        try {
            const data = await playbackHistoryService.continueWatching(signal);
            setContinueWatching(data);
            return data;
        }catch(err){
            setError(err);
            throw err;
        }finally{
            setLoading(false);
        }
    },
    []
    );

    useEffect(() => {
        const controller = new AbortController();

        fetchContinueWatching(controller.signal);

        return () => {
            controller.abort();
        }
    }, [fetchContinueWatching]);

    return {
        continueWatching,
        loading,
        error,
        refetch: fetchContinueWatching
    }
}