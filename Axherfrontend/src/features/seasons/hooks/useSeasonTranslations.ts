"use client";

import { SeasonAiTranslationRequest, SeasonAiTranslationResponse, SeasonTranslation, SeasonTranslationRequest } from "@/entities/types";
import { seasonTranslationService } from "@/features/seasons/services/SeasonTranslationService";
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
                await seasonTranslationService.getTranslations(seasonId);

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

    const createTranslation = useCallback(
        async (data: SeasonTranslationRequest) => {
            if (!seasonId) {
                throw new Error("Season ID is required");
            }

            setSaving(true);
            setError(null);

            try {
                const created =
                    await seasonTranslationService.createTranslation(
                        seasonId,
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
        [seasonId]
    );

    const updateTranslation = useCallback(
        async (
            languageId: number,
            data: SeasonTranslationRequest
        ) => {
            if (!seasonId) {
                throw new Error("Season ID is required");
            }

            setSaving(true);
            setError(null);

            try {
                const updated =
                    await seasonTranslationService.updateTranslation(
                        seasonId,
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
        [seasonId]
    );

    const translateWithAi = useCallback(
    
            async (
                sourceLanguageId: number,
                data: SeasonAiTranslationRequest
            ): Promise<SeasonAiTranslationResponse> => {
    
                if(!seasonId) {
                    throw new Error("Season ID is required");
                }
    
                setError(null);
    
                try {
                    return await seasonTranslationService.translateWithAi(
                        seasonId,
                        sourceLanguageId,
                        data
                    )
                } catch(err) {
                    setError(err);
                    throw err;
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

                await seasonTranslationService.deleteTranslation(
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
        createTranslation,
        updateTranslation,
        translateWithAi,
        deleteTranslation,
        refetch: fetchTranslations

    };
};