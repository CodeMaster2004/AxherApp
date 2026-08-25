"use client";

import {
    SupportCategoryTranslationRequest,
    SupportCategoryTranslationResponse,
} from "@/entities/types";
import { supportCategoryTranslationService } from "@/features/supportCategory/services/supportCategoryTranslationService";
import {
    useCallback,
    useEffect,
    useState,
} from "react";


export const useSupportCategoryTranslations = (
    categoryId?: number
) => {

    const [translations, setTranslations] = useState<
        SupportCategoryTranslationResponse[]
    >([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState<number | null>(null);
    const [error, setError] = useState<unknown | null>(null);

    const fetchTranslations = useCallback(async () => {

        if (!categoryId) {
            setTranslations([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {

            const data =
                await supportCategoryTranslationService.getAll(
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


    const saveTranslation = useCallback(
        async (
            data: SupportCategoryTranslationRequest
        ) => {

            if (!categoryId) {
                throw new Error(
                    "Support Category ID is required"
                );
            }

            setSaving(true);
            setError(null);

            try {

                const saved =
                    await supportCategoryTranslationService.save(
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


    const deleteTranslation = useCallback(
        async (languageId: number) => {

            if (!categoryId) {
                throw new Error(
                    "Support Category ID is required"
                );
            }

            setDeleting(languageId);
            setError(null);

            try {

                await supportCategoryTranslationService.delete(
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