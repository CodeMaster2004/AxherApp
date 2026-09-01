"use client";

import {
    SupportCategoryAiTranslationRequest,
    SupportCategoryAiTranslationResponse,
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


    const createTranslation = useCallback(
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
                const created =
                    await supportCategoryTranslationService.create(
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
                const updated =
                    await supportCategoryTranslationService.update(
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
                data: SupportCategoryAiTranslationRequest
            ): Promise<SupportCategoryAiTranslationResponse> => {
    
                if(!categoryId) {
                    throw new Error("Support Category ID is required");
                }
    
                setError(null);
    
                try {
                    return await supportCategoryTranslationService.translateWithAi(
                        categoryId,
                        sourceLanguageId,
                        data
                    )
                } catch(err) {
                    setError(err);
                    throw err;
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
        createTranslation,
        updateTranslation,
        translateWithAi,
        deleteTranslation,
        refetch: fetchTranslations,
    };
};