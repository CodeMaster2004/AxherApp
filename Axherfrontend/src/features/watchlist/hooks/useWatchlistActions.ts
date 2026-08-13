"use client";

import { WatchlistRequest, WatchlistResponse } from "@/entities/types";
import { watchlistService } from "@/features/watchlist/services/WatchlistService";
import { useCallback, useState } from "react";

type Options = {
    onSuccess?: (result?: WatchlistResponse) => void;
    onError?: (error: unknown) => void;
}

export const useWatchlistActions = (options?: Options) => {

    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState<number | null>(null);
    const [checking, setChecking] = useState<number | null>(null);
    const [error, setError] = useState<unknown | null>(null);


    const add = useCallback(
        async (contentId: number) => {

            setSaving(true);
            setError(null);

            try {
                const data: WatchlistRequest = {
                    contentId
                };
                const created = await watchlistService.add(data);
                options?.onSuccess?.(created);
                return created;
            } catch (error) {
                setError(error);
                options?.onError?.(error);
                throw error;
            }finally {
                setSaving(false);
            }
        },
        [options]
    );

    const remove = useCallback(
        async (contentId: number) => {

            setDeleting(contentId);
            setError(null);

            try {
                await watchlistService.remove(contentId);
                options?.onSuccess?.();
            } catch (error) {
                setError(error);
                options?.onError?.(error);
                throw error;
            } finally {
                setDeleting(null);
            }
        },
        [options]
    );

    const isInWatchlist = useCallback(
        async (contentId: number) => {

            setChecking(contentId);
            setError(null);

            try {
                return await watchlistService.isInWatchlist(contentId);
            }catch (error) {
                setError(error);
                options?.onError?.(error);
                throw error;
            }finally {
                setChecking(null);
            }
        },
        [options]
    );

    return {
        saving,
        deleting,
        checking,
        error,

        add,
        remove,
        isInWatchlist
    }
}