"use client";

import {
    HeroBannerAiTranslationRequest,
    HeroBannerAiTranslationResponse,
    HeroBannerTranslationRequest,
    HeroBannerTranslationResponse,
} from "@/entities/types";
import {
    heroBannerTranslationService,
} from "@/features/heroBanner/services/heroBannerTranslationService";
import {
    useCallback,
    useEffect,
    useState,
} from "react";
import { useTranslations } from "next-intl";

export const useHeroBannerTranslations = (
    heroBannerId?: number
) => {

    const t = useTranslations("heroBanner");

    const [translations, setTranslations] = useState<
        HeroBannerTranslationResponse[]
    >([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState<number | null>(
        null
    );
    const [error, setError] = useState<unknown | null>(null);


    const fetchTranslations = useCallback(async () => {

        if (!heroBannerId) {
            setTranslations([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {

            const data =
                await heroBannerTranslationService.getAll(
                    heroBannerId
                );

            setTranslations(data);

        } catch (err) {

            setError(err);
            throw err;

        } finally {

            setLoading(false);

        }

    }, [heroBannerId]);


    useEffect(() => {

        fetchTranslations();

    }, [fetchTranslations]);


    const createTranslation = useCallback(

        async (
            data: HeroBannerTranslationRequest
        ) => {

            if (!heroBannerId) {
                throw new Error(
                    t("errors.idRequired")
                );
            }

            setSaving(true);
            setError(null);

            try {

                const created =
                    await heroBannerTranslationService.create(
                        heroBannerId,
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

        [heroBannerId, t]

    );

    const updateTranslation = useCallback(

        async (
            languageId: number,
            data: HeroBannerTranslationRequest
        ) => {

            if (!heroBannerId) {
                throw new Error(
                    t("errors.idRequired")
                );
            }

            setSaving(true);
            setError(null);

            try {

                const updated =
                    await heroBannerTranslationService.update(
                        heroBannerId,
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

        [heroBannerId, t]

    );

    const translateWithAi = useCallback(
    
            async (
                sourceLanguageId: number,
                data: HeroBannerAiTranslationRequest
            ): Promise<HeroBannerAiTranslationResponse> => {
    
                if(!heroBannerId) {
                    throw new Error("Hero Banner ID is required");
                }
    
                setError(null);
    
                try {
                    return await heroBannerTranslationService.translateWithAi(
                        heroBannerId,
                        sourceLanguageId,
                        data
                    )
                } catch(err) {
                    setError(err);
                    throw err;
                }
            },
            [heroBannerId]
        );
    


    const deleteTranslation = useCallback(
        async (languageId: number) => {

            if (!heroBannerId) {
                throw new Error(
                    t("errors.idRequired")
                );
            }

            setDeleting(languageId);
            setError(null);

            try {

                await heroBannerTranslationService.delete(
                    heroBannerId,
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
        [heroBannerId, t]
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
