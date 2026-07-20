"use client";

import { PlaybackHistoryResponse } from "@/entities/types";
import { playbackHistoryService } from "@/features/playbackHistory/services/PlaybackHistoryService";
import { useCallback, useEffect, useState } from "react";

export const usePlaybackHistory = () => {

    const [history, setHistory] = useState<PlaybackHistoryResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<unknown | null>(null);

    const loadHistory = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await playbackHistoryService.getHistory();
            setHistory(data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadHistory();
    }, [loadHistory])

    return {
        history,
        loading,
        error,
        refresh: loadHistory
    }
}