"use client";
import { SupportTicketStatusTranslationRequest, SupportTicketStatusTranslationResponse } from "@/entities/types";
import { supportTicketStatusTranslationService } from "@/features/supportTicketStatus/service/supportTicketStatusTranslationService";
import {
    useCallback,
    useEffect,
    useState,
} from "react";


export const useSupportTicketStatusTranslations = (
    statusId?: number
) => {

    const [translations, setTranslations] = useState<
        SupportTicketStatusTranslationResponse[]
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
                await supportTicketStatusTranslationService.getAll(
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
            data: SupportTicketStatusTranslationRequest
        ) => {

            if (!statusId) {

                throw new Error(
                    "Support Ticket Status ID is required"
                );

            }

            setSaving(true);

            setError(null);

            try {

                const saved =
                    await supportTicketStatusTranslationService.save(
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
                    "Support Ticket Status ID is required"
                );

            }

            setDeleting(languageId);

            setError(null);

            try {

                await supportTicketStatusTranslationService.delete(
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