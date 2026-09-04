"use client";

import { CinematicRoleAiTranslationRequest, CinematicRoleAiTranslationResponse, CinematicRoleTranslationRequest, CinematicRoleTranslationResponse } from "@/entities/types";
import { cinematicRoleTranslationService } from "@/features/cinematicRole/services/cinematicRoleTranslationService";
import { useCallback, useEffect, useState } from "react";

export const useCinematicRoleTranslations = (
    roleId?: number
) => {

    const [
        translations,
        setTranslations
    ] = useState<CinematicRoleTranslationResponse[]>([]);

    const [loading, setLoading] = useState(false);

    const [saving, setSaving] = useState(false);

    const [
        deleting,
        setDeleting
    ] = useState<number | null>(null);

    const [
        error,
        setError
    ] = useState<unknown | null>(null);

    const fetchTranslations = useCallback(
        async () => {

            if (!roleId) {
                setTranslations([]);
                return;
            }

            setLoading(true);
            setError(null);

            try {

                const data =
                    await cinematicRoleTranslationService.getAll(
                        roleId
                    );

                setTranslations(data);

            } catch (err) {

                setError(err);
                throw err;

            } finally {

                setLoading(false);
            }

        },
        [roleId]
    );

    useEffect(() => {

        fetchTranslations();

    }, [fetchTranslations]);

    const createTranslation = useCallback(
        async (
            data: CinematicRoleTranslationRequest
        ) => {

            if (!roleId) {
                throw new Error(
                    "Cinematic Role ID is required"
                );
            }

            setSaving(true);
            setError(null);

            try {

                const created =
                    await cinematicRoleTranslationService.create(
                        roleId,
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
        [roleId]
    );

    const updateTranslation = useCallback(
        async (
            languageId: number,
            data: CinematicRoleTranslationRequest
        ) => {

            if (!roleId) {
                throw new Error(
                    "Cinematic Role ID is required"
                );
            }

            setSaving(true);
            setError(null);

            try {

                const updated =
                    await cinematicRoleTranslationService.update(
                        roleId,
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
        [roleId]
    );

    const translateWithAi = useCallback(
        async (
            sourceLanguageId: number,
            data: CinematicRoleAiTranslationRequest
        ): Promise<CinematicRoleAiTranslationResponse> => {

            if (!roleId) {
                throw new Error(
                    "Cinematic Role ID is required"
                );
            }

            setError(null);

            try {

                return await cinematicRoleTranslationService
                    .translateWithAi(
                        roleId,
                        sourceLanguageId,
                        data
                    );

            } catch (err) {

                setError(err);
                throw err;
            }
        },
        [roleId]
    );

    const deleteTranslation = useCallback(
        async (
            languageId: number
        ) => {

            if (!roleId) {
                throw new Error(
                    "Cinematic Role ID is required"
                );
            }

            setDeleting(languageId);
            setError(null);

            try {

                await cinematicRoleTranslationService.delete(
                    roleId,
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
        [roleId]
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