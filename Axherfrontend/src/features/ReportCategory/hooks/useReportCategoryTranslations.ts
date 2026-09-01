"use client";

import {
    ReportCategoryAiTranslationRequest,
    ReportCategoryAiTranslationResponse,
    ReportCategoryTranslationRequest,
    ReportCategoryTranslationResponse,
} from "@/entities/types";
import { reportCategoryTranslationService } from "@/features/ReportCategory/services/reportCategoryTranslationService";
import {
    useCallback,
    useEffect,
    useState,
} from "react";

export const useReportCategoryTranslations = (
    categoryId?: number
) => {

    const [translations, setTranslations] = useState<
        ReportCategoryTranslationResponse[]
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
                await reportCategoryTranslationService.getAll(
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
            data: ReportCategoryTranslationRequest
        ) => {

            if (!categoryId) {
                throw new Error(
                    "Report Category ID is required"
                );
            }

            setSaving(true);
            setError(null);

            try {

                const created =
                    await reportCategoryTranslationService.create(
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
            data: ReportCategoryTranslationRequest
        ) => {

            if (!categoryId) {
                throw new Error(
                    "Report Category ID is required"
                );
            }

            setSaving(true);
            setError(null);

            try {

                const updated =
                    await reportCategoryTranslationService.update(
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
                data: ReportCategoryAiTranslationRequest
            ): Promise<ReportCategoryAiTranslationResponse> => {
    
                if(!categoryId) {
                    throw new Error("Report Category ID is required");
                }
    
                setError(null);
    
                try {
                    return await reportCategoryTranslationService.translateWithAi(
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
                    "Report Category ID is required"
                );
            }

            setDeleting(languageId);
            setError(null);

            try {

                await reportCategoryTranslationService.delete(
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