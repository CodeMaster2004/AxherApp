"use client";

import { ContentStatusAiTranslationRequest, ContentStatusAiTranslationResponse, ContentStatusTranslationRequest, ContentStatusTranslationResponse } from "@/entities/types/status.types";
import { contentStatusTranslationService } from "@/features/contentStatus/services/contentStatusTranslationService";
import {
    useCallback,
    useEffect,
    useState,
} from "react";

export const useContentStatusTranslations = (
    statusId?: number
) => {

    const [translations, setTranslations] = useState<
        ContentStatusTranslationResponse[]
    >([]);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState<number | null>(null);
    const [error, setError] = useState<unknown | null>(null);


    const fetchTranslations = useCallback(async () => {

        if (!statusId) {

            setTranslations([]);

            return;
        }

        setLoading(true);
        setError(null);

        try {

            const data =
                await contentStatusTranslationService.getAll(
                    statusId
                );

            setTranslations(data);

        } catch (err) {

            setError(err);

            throw err;

        } finally {

            setLoading(false);
        }

    }, [statusId]);


    useEffect(() => {

        fetchTranslations();
    }, [fetchTranslations]);


    const createTranslation = useCallback(
        async (
            data: ContentStatusTranslationRequest
        ) => {

            if (!statusId) {

                throw new Error(
                    "Content Status ID is required"
                );
            }

            setSaving(true);
            setError(null);

            try {

                const created =
                    await contentStatusTranslationService.create(
                        statusId,
                        data
                    );
                    
                setTranslations(prev => [
                    ...prev,
                    created
                ]);
                return created;

            } catch (err) {

                setError(err);
                throw err;

            } finally {

                setSaving(false);
            }

        },
        [statusId]
    );

    const updateTranslation = useCallback(
        async (
            languageId: number,
            data: ContentStatusTranslationRequest
        ) => {

            if( !statusId) {

                throw new Error(
                    "Content Status ID is required"
                );
            }

            setSaving(true);
            setError(null);

            try {

                const updated =
                    await contentStatusTranslationService.update(
                        statusId,
                        languageId,
                        data
                    );

                setTranslations(prev =>
                    prev.map(translation =>
                        translation.languageId ===
                        languageId
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
        [statusId]
    );

    const translateWithAi = useCallback(
    
            async (
                sourceLanguageId: number,
                data: ContentStatusAiTranslationRequest
            ): Promise<ContentStatusAiTranslationResponse> => {
    
                if(!statusId) {
                    throw new Error("Content Status ID is required");
                }
    
                setError(null);
    
                try {
                    return await contentStatusTranslationService.translateWithAi(
                        statusId,
                        sourceLanguageId,
                        data
                    )
                } catch(err) {
                    setError(err);
                    throw err;
                }
            },
            [statusId]
        );
    


    const deleteTranslation = useCallback(
        async (languageId: number) => {

            if (!statusId) {

                throw new Error(
                    "Content Status ID is required"
                );
            }

            setDeleting(languageId);
            setError(null);

            try {

                await contentStatusTranslationService.delete(
                    statusId,
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
        [statusId]
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
