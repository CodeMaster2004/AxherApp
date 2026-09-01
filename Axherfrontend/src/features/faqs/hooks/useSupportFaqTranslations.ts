import { SupportFaqAiTranslationRequest, SupportFaqAiTranslationResponse, SupportFaqTranslationRequest, SupportFaqTranslationResponse } from "@/entities/types/supportFaq.types";
import { supportFaqTranslationService } from "@/features/faqs/services/supportFaqTranslationService";
import { useCallback, useEffect, useState } from "react";

export const useSupportFaqTranslations = (
    faqId: number,
) => {

    const [translations, setTranslations] = useState<
        SupportFaqTranslationResponse[]
    >([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState<number | null>(null);
    const [error, setError] = useState<unknown | null>(null);

    const fetchTranslations = useCallback(async () => {

        if(!faqId) {
            setTranslations([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await supportFaqTranslationService.getAll(faqId);
            setTranslations(data);
        }catch(err) {
            setError(err);
            throw err;
        }finally {
            setLoading(false);
        }
    }, [faqId]);

    useEffect(() => {
        fetchTranslations();
    }, [fetchTranslations]);

    const createTranslation = useCallback(
        async (
            data: SupportFaqTranslationRequest
        ) => {
            if(!faqId) {
                throw new Error("FAQ ID is required");
            }

            setSaving(true);
            setError(null);

            try {
                const created = await supportFaqTranslationService.create(
                    faqId,
                    data
                );

                setTranslations(prev => [
                    ...prev,
                    created
                ]);
                return created;

            }catch(err) {
                setError(err);
                throw err;
            }finally {
                setSaving(false);
            }
        },
        [faqId]
    );

    const updateTranslation = useCallback(
        async(
            languageId: number,
            data: SupportFaqTranslationRequest
        ) => {
            if(!faqId) {
                throw new Error("FAQ ID is required");
            }

            setSaving(true);
            setError(null);

            try {
                const updated = await supportFaqTranslationService.update(
                    faqId,
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
            }catch(err) {
                setError(err);
                throw err;
            }finally {
                setSaving(false);
            }
        },
        [faqId]
    );

    const translateWithAi = useCallback(

        async (
            sourceLanguageId: number,
            data: SupportFaqAiTranslationRequest
        ): Promise<SupportFaqAiTranslationResponse> => {

            if(!faqId) {
                throw new Error("FAQ ID is required");
            }

            setError(null);

            try {
                return await supportFaqTranslationService.translateWithAi(
                    faqId,
                    sourceLanguageId,
                    data
                )
            } catch(err) {
                setError(err);
                throw err;
            }
        },
        [faqId]
    );

    const deleteTranslation = useCallback(
        async(languageId: number) => {

            if(!faqId) {
                throw new Error("FAQ ID is required");
            }

            setDeleting(languageId);
            setError(null);

            try {
                await supportFaqTranslationService.delete(
                    faqId,
                    languageId
                );

                setTranslations(prev =>
                    prev.filter(
                        translation =>
                            translation.languageId !== languageId
                    )
                );
            }catch(err) {
                setError(err);
                throw err;
            }finally {
                setDeleting(null);
            }
        },
        [faqId]
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
    }

}