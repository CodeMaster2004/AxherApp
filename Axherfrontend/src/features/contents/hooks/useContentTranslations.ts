"use client";

import { ContentAiTranslationRequest, ContentAiTranslationResponse, ContentTranslation, ContentTranslationRequest } from "@/entities/types";
import { contentTranslationService } from "@/features/contents/services/ContentTranslationService";
import { useCallback, useEffect, useState } from "react";

export const useContentTranslations = (contentId?: number) => {

    const [translations, setTranslations] = useState<ContentTranslation[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState<number | null>(null);
    const [error, setError] = useState<unknown | null>(null);

    const fetchTranslations = useCallback(async () => {

        if(!contentId) {
            setTranslations([]);
            return;
        }
        setLoading(true);
        setError(null);

        try {
            const data = await contentTranslationService.getTranslations(contentId);
            setTranslations(data);
        }catch (err) {
            setError(err);
            throw err;
        }finally {
            setLoading(false);
        }
    },[contentId]);

    useEffect(() => {
        fetchTranslations();
    }, [fetchTranslations]);

    const createTranslation = useCallback(async (data: ContentTranslationRequest) => {

        if(!contentId) {
            throw new Error("Content ID is required");
        }
        setSaving(true);
        setError(null);

        try {
            const created = 
                await contentTranslationService.create(
                    contentId,
                    data
                )
            setTranslations(prev => [
                ...prev,
                created
            ]);
            return created;
        }catch (err) {
            setError(err);
            throw err;
        }finally {
            setSaving(false);
        }
    }, [contentId]);

    const updateTranslation = useCallback(
        async (
            languageId: number,
            data: ContentTranslationRequest
        ) => {
            if(!contentId) {
                throw new Error("Content ID is required");
            }

            setSaving(true);
            setError(null);

            try {

                const updated = 
                    await contentTranslationService.update(
                        contentId,
                        languageId,
                        data
                    );

                setTranslations((prev) => 
                    prev.map((translation) =>
                        translation.languageId === updated.languageId
                            ? updated
                            : translation
                    )
                );

                return updated;
            }catch (err) {
                setError(err);
                throw err;
            }finally {
                setSaving(false);
            }
        },
        [contentId]
    );

    const translateWithAi = useCallback(
    
            async (
                sourceLanguageId: number,
                data: ContentAiTranslationRequest
            ): Promise<ContentAiTranslationResponse> => {
    
                if(!contentId) {
                    throw new Error("Content ID is required");
                }
    
                setError(null);
    
                try {
                    return await contentTranslationService.translateWithAi(
                        contentId,
                        sourceLanguageId,
                        data
                    )
                } catch(err) {
                    setError(err);
                    throw err;
                }
            },
            [contentId]
        );
    

    const deleteTranslation = useCallback(async (languageId: number) => {

        if(!contentId) {
            throw new Error("Content ID is required");
        }
        setDeleting(languageId);
        setError(null);

        try {
            await contentTranslationService.deleteTranslation(contentId, languageId);
            setTranslations(prev =>
                    prev.filter(
                        translation =>
                            translation.languageId !== languageId
                    )
                );
        }catch (err) {
            setError(err);
            throw err;
        }finally {
            setDeleting(null);
        }
    }, [contentId]);

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
    }
}