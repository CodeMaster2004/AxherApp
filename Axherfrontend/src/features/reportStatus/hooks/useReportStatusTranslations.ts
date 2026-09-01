"use client";

import {
    ReportStatusAiTranslationRequest,
    ReportStatusAiTranslationResponse,
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

    const createTranslation = useCallback(

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

                const created =
                    await reportStatusTranslationService.create(
                        statusId,
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

        [statusId]

    );

    const updateTranslation = useCallback(

        async (
            languageId: number,
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

                const updated =
                    await reportStatusTranslationService.update(
                        statusId,
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

        [statusId]

    );

    const translateWithAi = useCallback(
    
            async (
                sourceLanguageId: number,
                data: ReportStatusAiTranslationRequest
            ): Promise<ReportStatusAiTranslationResponse> => {
    
                if(!statusId) {
                    throw new Error("Report Status ID is required");
                }
    
                setError(null);
    
                try {
                    return await reportStatusTranslationService.translateWithAi(
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
        createTranslation,
        updateTranslation,
        translateWithAi,
        deleteTranslation,
        refetch: fetchTranslations,
    };
};