"use client";

import { SeasonTranslation, SeasonTranslationRequest } from "@/entities/types";
import { seasonsService } from "@/features/seasons/services/SeasonsService";
import { useCallback, useEffect, useState } from "react";

export const useSeasonTranslations = (seasonId?: number) => {

    const [translations, setTranslations] = useState<SeasonTranslation[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState<number | null>(null);
    const [error, setError] = useState<unknown | null>(null);


    // ==========================================
    // OBTENER TRADUCCIONES
    // ==========================================

    const fetchTranslations = useCallback(async () => {

        if (!seasonId) {
            setTranslations([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {

            const data =
                await seasonsService.getTranslations(seasonId);

            setTranslations(data);

        } catch (err) {

            setError(err);
            throw err;

        } finally {

            setLoading(false);

        }

    }, [seasonId]);


    useEffect(() => {

        fetchTranslations();

    }, [fetchTranslations]);


    // ==========================================
    // CREAR / ACTUALIZAR TRADUCCIÓN
    // ==========================================

    const saveTranslation = useCallback(
        async (data: SeasonTranslationRequest) => {

            if (!seasonId) {
                throw new Error("Season ID is required");
            }

            setSaving(true);
            setError(null);

            try {

                const saved =
                    await seasonsService.saveTranslation(
                        seasonId,
                        data
                    );

                setTranslations(prev => {

                    const index = prev.findIndex(
                        translation =>
                            translation.languageId === saved.languageId
                    );

                    // Nueva traducción
                    if (index === -1) {
                        return [...prev, saved];
                    }

                    // Actualizar traducción existente
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
        [seasonId]
    );


    // ==========================================
    // ELIMINAR TRADUCCIÓN
    // ==========================================

    const deleteTranslation = useCallback(
        async (languageId: number) => {

            if (!seasonId) {
                throw new Error("Season ID is required");
            }

            setDeleting(languageId);
            setError(null);

            try {

                await seasonsService.deleteTranslation(
                    seasonId,
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
        [seasonId]
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