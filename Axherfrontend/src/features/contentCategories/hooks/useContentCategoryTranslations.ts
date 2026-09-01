"use client";

import {
    ContentCategoryAiTranslationRequest,
    ContentCategoryAiTranslationResponse,
    ContentCategoryTranslationRequest,
    ContentCategoryTranslationResponse,
} from "@/entities/types";
import { contentCategoryTranslationService } from "@/features/contentCategories/services/contentCategoryTranslationService";
import {
    useCallback,
    useEffect,
    useState,
} from "react";

export const useContentCategoryTranslations = (
    categoryId?: number
) => {

    const [translations, setTranslations] = useState<
        ContentCategoryTranslationResponse[]
    >([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState<number | null>(null);
    const [error, setError] = useState<unknown | null>(null);


    // =============================
    // OBTENER TRADUCCIONES
    // =============================
    const fetchTranslations = useCallback(async () => {

        if (!categoryId) {
            setTranslations([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {

            const data =
                await contentCategoryTranslationService.getAll(
                    categoryId
                );

            setTranslations(data);

        } catch (err) {

            setError(err);
            throw err;

        } finally {

            setLoading(false);

        }

    }, [categoryId]);


    useEffect(() => {
        fetchTranslations();
    }, [fetchTranslations]);

    // =============================
    // GUARDAR 
    // =============================
    const createTranslation = useCallback(
        async (
            data: ContentCategoryTranslationRequest
        ) => {
            if (!categoryId) {
                throw new Error(
                    "Content Category ID is required"
                );
            }

            setSaving(true);
            setError(null);

            try {
                const created =
                    await contentCategoryTranslationService.create(
                        categoryId,
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
        [categoryId]
    );

    const updateTranslation = useCallback(
        async (
            languageId: number,
            data: ContentCategoryTranslationRequest
        ) => {
            if (!categoryId) {
                throw new Error(
                    "Content Category ID is required"
                );
            }

            setSaving(true);
            setError(null);

            try {
                const updated =
                    await contentCategoryTranslationService.update(
                        categoryId,
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
        [categoryId]
    );

    const translateWithAi = useCallback(
        async (
            sourceLanguageId: number,
            data: ContentCategoryAiTranslationRequest
        ): Promise<ContentCategoryAiTranslationResponse> => {
            if (!categoryId) {
                throw new Error(
                    "Content Category ID is required"
                );
            }

            setError(null);

            try {
                return await contentCategoryTranslationService.translateWithAi(
                    categoryId,
                    sourceLanguageId,
                    data
                );
            } catch (error) {
                setError(error);
                throw error;
            }
        },
        [categoryId]
    );

    // =============================
    // ELIMINAR
    // =============================
    const deleteTranslation = useCallback(
        async (languageId: number) => {

            if (!categoryId) {
                throw new Error(
                    "Content Category ID is required"
                );
            }

            setDeleting(languageId);
            setError(null);

            try {

                await contentCategoryTranslationService.delete(
                    categoryId,
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
        [categoryId]
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