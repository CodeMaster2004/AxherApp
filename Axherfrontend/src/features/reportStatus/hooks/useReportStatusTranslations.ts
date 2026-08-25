"use client";

import {
    ReportStatusTranslationRequest,
    ReportStatusTranslationResponse,
} from "@/entities/types/reportStatus.types";
import { reportStatusTranslationService } from "@/features/reportStatus/services/reportStatusTranslationService";
import {
    useCallback,
    useEffect,
    useState,
} from "react";

export const useReportStatusTranslations = (
    statusId?: number
) => {
    const [translations, setTranslations] = useState<
        ReportStatusTranslationResponse[]
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
                await reportStatusTranslationService.getAll(
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

    const saveTranslation = useCallback(
        async (
            data: ReportStatusTranslationRequest
        ) => {
            if (!statusId) {
                throw new Error(
                    "Report Status ID is required"
                );
            }

            setSaving(true);
            setError(null);

            try {
                const saved =
                    await reportStatusTranslationService.save(
                        statusId,
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
        [statusId]
    );

    const deleteTranslation = useCallback(
        async (languageId: number) => {
            if (!statusId) {
                throw new Error(
                    "Report Status ID is required"
                );
            }

            setDeleting(languageId);
            setError(null);

            try {
                await reportStatusTranslationService.delete(
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
        saveTranslation,
        deleteTranslation,
        refetch: fetchTranslations,
    };
};