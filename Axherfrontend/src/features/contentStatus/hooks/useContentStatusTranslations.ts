"use client";

import { ContentStatusTranslationRequest, ContentStatusTranslationResponse } from "@/entities/types/status.types";
import { contentStatusTranslationService } from "@/features/contentStatus/services/contentStatusTranslationService";
import {
    useCallback,
    useEffect,
    useState,
} from "react";

export const useContentStatusTranslations = (
    statusId?: number
) => {

    const [translations, setTranslations] = useState<
        ContentStatusTranslationResponse[]
    >([]);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState<number | null>(null);
    const [error, setError] = useState<unknown | null>(null);


    const fetchTranslations = useCallback(async () => {

        if (!statusId) {

            setTranslations([]);

            return;
        }

        setLoading(true);
        setError(null);

        try {

            const data =
                await contentStatusTranslationService.getAll(
                    statusId
                );

            setTranslations(data);

        } catch (err) {

            setError(err);

            throw err;

        } finally {

            setLoading(false);
        }

    }, [statusId]);


    useEffect(() => {

        fetchTranslations();
    }, [fetchTranslations]);


    const saveTranslation = useCallback(
        async (
            data: ContentStatusTranslationRequest
        ) => {

            if (!statusId) {

                throw new Error(
                    "Content Status ID is required"
                );
            }

            setSaving(true);
            setError(null);

            try {

                const saved =
                    await contentStatusTranslationService.save(
                        statusId,
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
                            saved
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
        [statusId]
    );


    const deleteTranslation = useCallback(
        async (languageId: number) => {

            if (!statusId) {

                throw new Error(
                    "Content Status ID is required"
                );
            }

            setDeleting(languageId);
            setError(null);

            try {

                await contentStatusTranslationService.delete(
                    statusId,
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
        [statusId]
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
