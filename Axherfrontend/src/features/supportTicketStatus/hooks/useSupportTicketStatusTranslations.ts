"use client";
import { SupportTicketStatusAiTranslationRequest, SupportTicketStatusAiTranslationResponse, SupportTicketStatusTranslationRequest, SupportTicketStatusTranslationResponse } from "@/entities/types";
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


    const createTranslation = useCallback(
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
                const created =
                    await supportTicketStatusTranslationService.create(
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
                const updated =
                    await supportTicketStatusTranslationService.update(
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
            data: SupportTicketStatusAiTranslationRequest
        ): Promise<SupportTicketStatusAiTranslationResponse> => {

            if(!statusId) {
                throw new Error("Support Ticket Status ID is required");
            }

            setError(null);

            try {
                return await supportTicketStatusTranslationService.translateWithAi(
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
        createTranslation,
        updateTranslation,
        translateWithAi,
        deleteTranslation,
        refetch: fetchTranslations,
    };
};