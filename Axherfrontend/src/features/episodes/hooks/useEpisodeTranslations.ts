"use client";

import { EpisodeAiTranslationRequest, EpisodeAiTranslationResponse, EpisodeTranslation, EpisodeTranslationRequest } from "@/entities/types";
import { episodeTranslationService } from "@/features/episodes/services/EpisodeTranslationService";
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
                await episodeTranslationService.getTranslations(episodeId);

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
    // CREAR 
    // ==========================================
    const createTranslation = useCallback(
        async (data: EpisodeTranslationRequest) => {
            if (!episodeId) {
                throw new Error("Episode ID is required");
            }

            setSaving(true);
            setError(null);

            try {
                const created =
                    await episodeTranslationService.create(
                        episodeId,
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
        [episodeId]
    );

    const updateTranslation = useCallback(
        async (
            languageId: number,
            data: EpisodeTranslationRequest
        ) => {
            if (!episodeId) {
                throw new Error("Episode ID is required");
            }

            setSaving(true);
            setError(null);

            try {
                const updated =
                    await episodeTranslationService.update(
                        episodeId,
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
        [episodeId]
    );

    const translateWithAi = useCallback(
    
            async (
                sourceLanguageId: number,
                data: EpisodeAiTranslationRequest
            ): Promise<EpisodeAiTranslationResponse> => {
    
                if(!episodeId) {
                    throw new Error("Episode ID is required");
                }
    
                setError(null);
    
                try {
                    return await episodeTranslationService.translateWithAi(
                        episodeId,
                        sourceLanguageId,
                        data
                    )
                } catch(err) {
                    setError(err);
                    throw err;
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

                await episodeTranslationService.deleteTranslation(
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
        updateTranslation,
        createTranslation,
        translateWithAi,
        deleteTranslation,
        refetch: fetchTranslations

    };
};