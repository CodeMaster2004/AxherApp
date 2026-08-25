"use client";

import {
    ContentShelfTranslationRequest,
    ContentShelfTranslationResponse,
} from "@/entities/types";
import { contentShelfTranslationService } from "@/features/shelf/services/contentShelfTranslationService";

import {
    useCallback,
    useEffect,
    useState,
} from "react";

export const useContentShelfTranslations = (
    shelfId?: number
) => {
    const [translations, setTranslations] = useState<
        ContentShelfTranslationResponse[]
    >([]);

    const [loading, setLoading] = useState(false);

    const [saving, setSaving] = useState(false);

    const [deleting, setDeleting] = useState<number | null>(
        null
    );

    const [error, setError] = useState<unknown | null>(null);

    const fetchTranslations = useCallback(async () => {
        if (!shelfId) {
            setTranslations([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data =
                await contentShelfTranslationService.getAll(
                    shelfId
                );

            setTranslations(data);
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [shelfId]);

    useEffect(() => {
        fetchTranslations();
    }, [fetchTranslations]);

    const saveTranslation = useCallback(
        async (
            data: ContentShelfTranslationRequest
        ) => {
            if (!shelfId) {
                throw new Error(
                    "Content Shelf ID is required"
                );
            }

            setSaving(true);
            setError(null);

            try {
                const saved =
                    await contentShelfTranslationService.save(
                        shelfId,
                        data
                    );

                setTranslations(prev => {
                    const index = prev.findIndex(
                        translation =>
                            translation.languageId ===
                            saved.languageId
                    );

                    if (index === -1) {
                        return [
                            ...prev,
                            saved,
                        ];
                    }

                    const updated = [...prev];

                    updated[index] = saved;

                    return updated;
                });

                return saved;
            } catch (err) {
                setError(err);
                throw err;
            } finally {
                setSaving(false);
            }
        },
        [shelfId]
    );

    const deleteTranslation = useCallback(
        async (languageId: number) => {
            if (!shelfId) {
                throw new Error(
                    "Content Shelf ID is required"
                );
            }

            setDeleting(languageId);
            setError(null);

            try {
                await contentShelfTranslationService.delete(
                    shelfId,
                    languageId
                );

                setTranslations(prev =>
                    prev.filter(
                        translation =>
                            translation.languageId !==
                            languageId
                    )
                );
            } catch (err) {
                setError(err);
                throw err;
            } finally {
                setDeleting(null);
            }
        },
        [shelfId]
    );

    return {
        translations,
        loading,
        saving,
        deleting,
        error,
        saveTranslation,
        deleteTranslation,
        refetch: fetchTranslations,
    };
};