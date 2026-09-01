"use client";
import {
    useContentStatusTranslations,
} from "@/features/contentStatus/hooks/useContentStatusTranslations";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import { useState } from "react";
import ContentStatusTranslationForm from "./ContentStatusTranslationForm";
import ContentStatusTranslationList from "./ContentStatusTranslationList";
import { LanguageResponse } from "@/entities/types";
import { ContentStatusTranslationRequest, ContentStatusTranslationResponse } from "@/entities/types/status.types";
import { useTranslations } from "next-intl";
import ContentStatusAiTranslationDialog from "@/features/contentStatus/components/translation/ContentStatusAiTranlationDialog";

interface Props {
    statusId: number;
    languages: LanguageResponse[];
}

export default function ContentStatusTranslationsPanel({
    statusId,
    languages,
}: Props) {

    const [translating, setTranslating] = useState(false);
    const [sourceTranslation, setSourceTranslation] = useState<ContentStatusTranslationResponse | null>(null);
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
    } = useContentStatusTranslations(statusId);

    const [form, setForm] =
        useState<ContentStatusTranslationRequest>({
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
        translation: ContentStatusTranslationResponse
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
        translation: ContentStatusTranslationResponse
    ) => {

        setEditingLanguageId(translation.languageId);

        setForm({
            languageId: translation.languageId,
            name: translation.name,
            description: translation.description ?? "",
        });
    };

    const handleCancelEdit = () => {

        resetForm();
    };

    const t = useTranslations("contentStatus");

    return (
        <div className={layoutStyles.pageContainer}>

            <div className={layoutStyles.header}>
                <h1>{t("translations.title")}</h1>
            </div>

            <section className={layoutStyles.section}>

                <ContentStatusTranslationForm
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
                        {t("errors.translation")}
                    </p>
                )}

            </section>

            <section className={layoutStyles.section}>

                <h2>{t("translations.registeredTitle")}</h2>

                {loading ? (
                    <p>{t("translations.loading")}</p>
                ) : (
                    <ContentStatusTranslationList
                        translations={translations}
                        deleting={deleting}
                        onDelete={deleteTranslation}
                        onEdit={handleEdit}
                        onTranslate={handleTranslate}
                    />
                )}

            </section>
            {sourceTranslation && (
                <ContentStatusAiTranslationDialog
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