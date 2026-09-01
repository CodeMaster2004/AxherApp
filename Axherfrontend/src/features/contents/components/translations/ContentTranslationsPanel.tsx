"use client";

import {
    ContentTranslation,
    ContentTranslationRequest,
    LanguageResponse,
} from "@/entities/types";
import { useContentTranslations } from "@/features/contents/hooks/useContentTranslations";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import { useState } from "react";
import TranslationForm from "./TranslationForm";
import TranslationList from "./TranslationList";
import { useTranslations } from "next-intl";
import ContentAiTranslationDialog from "@/features/contents/components/translations/ContentAiTranslationDialog";

interface Props {
    contentId: number;
    languages: LanguageResponse[];
}

export default function ContentTranslationsPanel({
    contentId,
    languages,
}: Props) {

    const t = useTranslations("contents");
    const [translating, setTranslating] = useState(false);
    const [sourceTranslation, setSourceTranslation] = useState<ContentTranslation | null>(null);
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
    } = useContentTranslations(contentId);

    const [form, setForm] =
        useState<ContentTranslationRequest>({
            languageId: 0,
            title: "",
            description: "",
        });

    const resetForm = () => {
        setForm({
            languageId: 0,
            title: "",
            description: "",
        });

        setEditingLanguageId(null);
    }
    const [editingLanguageId, setEditingLanguageId] = useState<number | null>(null);

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
        translation: ContentTranslation
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
                title:
                    translated.translatedTitle,
                description:
                    translated.translatedDescription,
            });

            setAiDialogOpen(false);
            setSourceTranslation(null);
        } finally {
            setTranslating(false);
        }
    };

    const handleEdit = (translation: ContentTranslation) => {

        setEditingLanguageId(translation.languageId);

        setForm({
            languageId: translation.languageId,
            title: translation.title,
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

                <TranslationForm
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
                        {t("translations.error")}
                    </p>
                )}

            </section>

            <section className={layoutStyles.section}>

                <h2>{t("translations.registeredTitle")}</h2>

                {loading ? (
                    <p>{t("translations.loading")}</p>
                ) : (
                    <TranslationList
                        translations={translations}
                        deleting={deleting}
                        onDelete={deleteTranslation}
                        onEdit={handleEdit}
                        onTranslate={handleTranslate}
                    />
                )}

            </section>
            {sourceTranslation && (
                <ContentAiTranslationDialog
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