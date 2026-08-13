"use client";

import { SearchHistoryRequest, SearchHistoryResponse } from "@/entities/types";
import { searchHistoryService } from "@/features/search/service/SearchHistoryService";
import { useCallback, useState } from "react";

type Options = {
    onSuccess?: (result?: SearchHistoryResponse) => void;
    onError?: (error: unknown) => void;
}

export const useSearchHistoryActions = (options?: Options) => {

    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState<number | null>(null);
    const [clearing, setClearing] = useState(false);
    const [error, setError] = useState<unknown | null>(null);

    const save = useCallback(

        async (data: SearchHistoryRequest) => {
            
            setSaving(true);
            setError(null);

            try {
                const created = await searchHistoryService.save(data);
                options?.onSuccess?.(created);
                return created;
            }catch (err) {
                setError(err);
                options?.onError?.(err);
                throw err;
            }finally{
                setSaving(false);
            }
        },
        [options]
    );

    const remove = useCallback(
        async (searchId: number) => {

            setDeleting(searchId);
            setError(null);

            try {
                await searchHistoryService.delete(searchId);
                options?.onSuccess?.();
            }catch (err) {
                setError(err);
                options?.onError?.(err);
                throw err;
            }finally{
                setDeleting(null);
            }
        },
        [options]
    );

    const clear = useCallback (
        async () => {
            setClearing(true);
            setError(null);

            try {
                await searchHistoryService.clear();
                options?.onSuccess?.();
            } catch (err) {
                setError(err);
                options?.onError?.(err);
                throw err;
            } finally {
                setClearing(false);
            }
        },
        [options]
    );

    return {
        saving,
        deleting,
        clearing,
        error,

        save,
        remove,
        clear
    }
}