"use client";

import {
    ContentShelfAiTranslationRequest,
    ContentShelfAiTranslationResponse,
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

    const createTranslation = useCallback(
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
                const created =
                    await contentShelfTranslationService.create(
                        shelfId,
                        data
                    );

                setTranslations(prev => [
                    ...prev,
                    created,
                ]);

                return created;
            } catch (err) {
                setError(err);
                throw err;
            } finally {
                setSaving(false);
            }
        },
        [shelfId]
    );

    const updateTranslation = useCallback(
        async (
            languageId: number,
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
                const updated =
                    await contentShelfTranslationService.update(
                        shelfId,
                        languageId,
                        data
                    );

                setTranslations(prev =>
                    prev.map(translation =>
                        translation.languageId === languageId
                            ? updated
                            : translation
                    )
                );

                return updated;
            } catch (err) {
                setError(err);
                throw err;
            } finally {
                setSaving(false);
            }
        },
        [shelfId]
    );

    const translateWithAi = useCallback(
    
            async (
                sourceLanguageId: number,
                data: ContentShelfAiTranslationRequest
            ): Promise<ContentShelfAiTranslationResponse> => {
    
                if(!shelfId) {
                    throw new Error("Content Shelf ID is required");
                }
    
                setError(null);
    
                try {
                    return await contentShelfTranslationService.translateWithAi(
                        shelfId,
                        sourceLanguageId,
                        data
                    )
                } catch(err) {
                    setError(err);
                    throw err;
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
        createTranslation,
        updateTranslation,
        translateWithAi,
        deleteTranslation,
        refetch: fetchTranslations,
    };
};