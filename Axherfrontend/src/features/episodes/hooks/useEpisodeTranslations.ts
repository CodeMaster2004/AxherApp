"use client";

import { EpisodeTranslation, EpisodeTranslationRequest } from "@/entities/types";
import { episodesService } from "@/features/episodes/services/EpisodesService";
import { useCallback, useEffect, useState } from "react";

export const useEpisodeTranslations = (episodeId?: number) => {

    const [translations, setTranslations] = useState<EpisodeTranslation[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState<number | null>(null);
    const [error, setError] = useState<unknown | null>(null);

    // ==========================================
    // OBTENER TRADUCCIONES
    // ==========================================
    const fetchTranslations = useCallback(async () => {

        if (!episodeId) {
            setTranslations([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {

            const data =
                await episodesService.getTranslations(episodeId);

            setTranslations(data);

        } catch (err) {

            setError(err);
            throw err;

        } finally {

            setLoading(false);

        }

    }, [episodeId]);


    useEffect(() => {

        fetchTranslations();

    }, [fetchTranslations]);


    // ==========================================
    // CREAR / ACTUALIZAR
    // ==========================================

    const saveTranslation = useCallback(
        async (data: EpisodeTranslationRequest) => {

            if (!episodeId) {
                throw new Error("Episode ID is required");
            }

            setSaving(true);
            setError(null);

            try {

                const saved =
                    await episodesService.saveTranslation(
                        episodeId,
                        data
                    );

                setTranslations(prev => {

                    const index = prev.findIndex(
                        translation =>
                            translation.languageId === saved.languageId
                    );

                    if (index === -1) {
                        return [...prev, saved];
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
        [episodeId]
    );


    // ==========================================
    // ELIMINAR
    // ==========================================

    const deleteTranslation = useCallback(
        async (languageId: number) => {

            if (!episodeId) {
                throw new Error("Episode ID is required");
            }

            setDeleting(languageId);
            setError(null);

            try {

                await episodesService.deleteTranslation(
                    episodeId,
                    languageId
                );

                setTranslations(prev =>
                    prev.filter(
                        translation =>
                            translation.languageId !== languageId
                    )
                );

            } catch (err) {

                setError(err);
                throw err;

            } finally {

                setDeleting(null);
            }
        },
        [episodeId]
    );


    return {

        translations,
        loading,
        saving,
        deleting,
        error,
        saveTranslation,
        deleteTranslation,
        refetch: fetchTranslations

    };
};