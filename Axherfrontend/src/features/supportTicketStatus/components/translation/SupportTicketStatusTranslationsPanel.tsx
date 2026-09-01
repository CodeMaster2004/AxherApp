"use client";

import { LanguageResponse } from "@/entities/types";
import {
    SupportTicketStatusTranslationRequest,
    SupportTicketStatusTranslationResponse,
} from "@/entities/types/supportTicketStatus.types";
import {
    useSupportTicketStatusTranslations,
} from "@/features/supportTicketStatus/hooks/useSupportTicketStatusTranslations";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import { useState } from "react";
import SupportTicketStatusTranslationForm
    from "./SupportTicketStatusTranslationForm";
import SupportTicketStatusTranslationList
    from "./SupportTicketStatusTranslationList";
import { useTranslations } from "next-intl";
import SupportTicketStatusAiTranslationDialog from "@/features/supportTicketStatus/components/translation/SupportTicketStatusAiTranslationDialog";

interface Props {
    statusId: number;
    languages: LanguageResponse[];
}

export default function SupportTicketStatusTranslationsPanel({
    statusId,
    languages,
}: Props) {

    const t = useTranslations("supportTicketStatus");
    const [translating, setTranslating] = useState(false);
    const [sourceTranslation, setSourceTranslation] = useState<SupportTicketStatusTranslationResponse | null>(null);
    const [aiDialogOpen, setAiDialogOpen] = useState(false);

    const {
        translations,
        loading,
        saving,
        deleting,
        error,
        createTranslation,
        updateTranslation,
        translateWithAi,
        deleteTranslation,
    } = useSupportTicketStatusTranslations(statusId);

    const [form, setForm] =
        useState<SupportTicketStatusTranslationRequest>({
            languageId: 0,
            name: "",
            description: "",
        });

    const resetForm = () => {
        setForm({
            languageId: 0,
            name: "",
            description: "",
        });

        setEditingLanguageId(null);
    }

    const [editingLanguageId, setEditingLanguageId] =
        useState<number | null>(null);

    const handleSubmit = async () => {

        if (!form.languageId) {
            return;
        }

        if(editingLanguageId !== null) {
            await updateTranslation(
                editingLanguageId,
                form
            );
        }else {
            await createTranslation(form);
        }

        resetForm();
    };

    const handleTranslate = (
        translation: SupportTicketStatusTranslationResponse
    ) => {
        setSourceTranslation(translation);
        setAiDialogOpen(true);
    };

    const handleCloseAiDialog = () => {
        if (translating) {
            return;
        }

        setAiDialogOpen(false);
        setSourceTranslation(null);
    };

    const handleAiTranslation = async (
        targetLanguageId: number
    ) => {
        if (!sourceTranslation) {
            return;
        }

        setTranslating(true);

        try {
            const translated = await translateWithAi(
                sourceTranslation.languageId,
                {
                    targetLanguageId,
                }
            );

            setForm({
                languageId:
                    translated.targetLanguageId,
                name:
                    translated.translatedName,
                description:
                    translated.translatedDescription,
            });

            setAiDialogOpen(false);
            setSourceTranslation(null);
        } finally {
            setTranslating(false);
        }
    };

    const handleEdit = (
        translation: SupportTicketStatusTranslationResponse
    ) => {

        setEditingLanguageId(
            translation.languageId
        );

        setForm({
            languageId: translation.languageId,
            name: translation.name,
            description: translation.description ?? "",
        });
    };

    const handleCancelEdit = () => {

        resetForm();
    };


    return (
        <div className={layoutStyles.pageContainer}>

            <div className={layoutStyles.header}>
                <h1>{t("translations.title")}</h1>
            </div>

            <section className={layoutStyles.section}>

                <SupportTicketStatusTranslationForm
                    languages={languages}
                    value={form}
                    onChange={setForm}
                    onSubmit={handleSubmit}
                    saving={saving}
                    editing={editingLanguageId !== null}
                    onCancel={handleCancelEdit}
                />

                {Boolean(error) && (
                    <p role="alert">
                        {t("error.translation")}
                    </p>
                )}

            </section>

            <section className={layoutStyles.section}>

                <h2>
                    {t("translations.registeredTitle")}
                </h2>

                {loading ? (
                    <p>
                        {t("translations.loading")}
                    </p>
                ) : (
                    <SupportTicketStatusTranslationList
                        translations={translations}
                        deleting={deleting}
                        onDelete={deleteTranslation}
                        onEdit={handleEdit}
                        onTranslate={handleTranslate}
                    />
                )}

            </section>
            {sourceTranslation && (
                <SupportTicketStatusAiTranslationDialog
                    open={aiDialogOpen}
                    sourceTranslation={sourceTranslation}
                    languages={languages}
                    onConfirm={handleAiTranslation}
                    onClose={handleCloseAiDialog}
                    translating={translating}
                />
            )}

        </div>
    );
}
