"use client";

import {
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


    const saveTranslation = useCallback(
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

                const saved =
                    await heroBannerTranslationService.save(
                        heroBannerId,
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
        [heroBannerId, t]
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
        saveTranslation,
        deleteTranslation,
        refetch: fetchTranslations,
    };
};
