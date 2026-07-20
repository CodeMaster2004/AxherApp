"use client";

import { playbackHistoryService } from '@/features/playbackHistory/services/PlaybackHistoryService';
import { useCallback, useMemo, useState } from 'react';
import { PlaybackHistoryRequest, PlaybackHistoryResponse } from '../../../entities/types';

export const usePlaybackProgress = () => {

    const [progress, setProgress] = useState<PlaybackHistoryResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<unknown>(null);

    const loadProgress = useCallback(
        async (
            contentId: number,
            episodeId?: number
        ) => {
            setLoading(true);
            setError(null);

            try {

                const data = await playbackHistoryService.getProgress(contentId, episodeId);

                setProgress(data);
                return data;
            }catch (err) {
                setError(err);
                throw err;
            }finally {
                setLoading(false);
            }
        },[]
    );

    const saveProgress = useCallback(
        async (data: PlaybackHistoryRequest) => {
            setSaving(true);
            setError(null);

            try {
                const saved = await playbackHistoryService.saveOrUpdate(data);
                setProgress(saved);
                return saved;
            }catch (err) {
                setError(err);
                throw err;
            }finally {
                setSaving(false);
            }
        },[]
    );

    return useMemo(() => ({
        progress,
        loading,
        saving,
        error,
        loadProgress,
        saveProgress,
    }),[
        progress,
        loading,
        saving,
        error,
        loadProgress,
        saveProgress
    ]);
};