"use client";

import {
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
    // GUARDAR / ACTUALIZAR
    // =============================
    const saveTranslation = useCallback(
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

                const saved =
                    await contentCategoryTranslationService.save(
                        categoryId,
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

        saveTranslation,
        deleteTranslation,
        refetch: fetchTranslations,

    };
};