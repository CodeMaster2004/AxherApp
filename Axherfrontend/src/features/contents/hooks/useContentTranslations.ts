"use client";

import { ContentTranslation, ContentTranslationRequest } from "@/entities/types";
import { contentService } from "@/features/contents/services/ContentService";
import { useCallback, useEffect, useState } from "react";

export const useContentTranslations = (contentId?: number) => {

    const [translations, setTranslations] = useState<ContentTranslation[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState<number | null>(null);
    const [error, setError] = useState<unknown | null>(null);

    const fetchTranslations = useCallback(async () => {

        if(!contentId) {
            setTranslations([]);
            return;
        }
        setLoading(true);
        setError(null);

        try {
            const data = await contentService.getTranslations(contentId);
            setTranslations(data);
        }catch (err) {
            setError(err);
            throw err;
        }finally {
            setLoading(false);
        }
    },[contentId]);

    useEffect(() => {
        fetchTranslations();
    }, [fetchTranslations]);

    const saveTranslation = useCallback(async (data: ContentTranslationRequest) => {

        if(!contentId) {
            throw new Error("Content ID is required");
        }
        setSaving(true);
        setError(null);

        try {
            const saved = await contentService.saveTranslation(contentId, data);

            setTranslations(prev => {
                const index = prev.findIndex(
                    translation => translation.languageId === saved.languageId
                );

                if (index === -1) {
                    return [...prev, saved];
                }

                const updated = [...prev];
                updated[index] = saved;

                return updated;
            });
            return saved;
        }catch (err) {
            setError(err);
            throw err;
        }finally {
            setSaving(false);
        }
    }, [contentId]);

    const deleteTranslation = useCallback(async (languageId: number) => {

        if(!contentId) {
            throw new Error("Content ID is required");
        }
        setDeleting(languageId);
        setError(null);

        try {
            await contentService.deleteTranslation(contentId, languageId);
            setTranslations(prev =>
                    prev.filter(
                        translation =>
                            translation.languageId !== languageId
                    )
                );
        }catch (err) {
            setError(err);
            throw err;
        }finally {
            setDeleting(null);
        }
    }, [contentId]);

    return {
        translations,

        loading,
        saving,
        deleting,
        error,

        saveTranslation,
        deleteTranslation,

        refetch: fetchTranslations
    }
}