"use client";

import { RatingRequest, RatingResponse } from "@/entities/types";
import { ratingsService } from "@/features/ratings/services/ratingsService";
import { useCallback, useState } from "react";

type Options = {
    onSuccess?: (result?: RatingResponse) => void;
    onError?: (error: unknown) => void;
};

export const useRatingsActions = (options?: Options) => {

    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState<number | null>(null);
    const [error, setError] = useState<unknown | null>(null);

    const addRating = useCallback(
        async(data: Omit<RatingRequest, "ratingId">) => {
            setSaving(true);
            setError(null);
            try {
                const created = await ratingsService.create(data);
                options?.onSuccess?.(created);
                return created;
            }catch(err) {
                setError(err);
                options?.onError?.(err);
                throw err;
            }finally {
                setSaving(false);
            }
        },
        [options]
    );

    const editRating = useCallback(
        async(id: number, data: Partial<RatingRequest>) => {
            setSaving(true);
            setError(null);
            try {
                const updated = await ratingsService.update(id, data);
                options?.onSuccess?.(updated);
                return updated;
            }catch(err) {
                setError(err);
                options?.onError?.(err);
                throw err;
            }finally {
                setSaving(false);
            }
        },
        [options]
    );

    const removeRating = useCallback( async(id: number) => {
        setDeleting(id);
        setError(null);
        try {
            await ratingsService.delete(id);
            options?.onSuccess?.();
        }catch(err) {
            setError(err);
            options?.onError?.(err);
            throw err;
        }finally {
            setDeleting(null);
        }
    },
    [options]
    );

    return {
        saving,
        deleting,
        error,

        addRating,
        editRating,
        removeRating,
    }
}