"use client";

import {
    SeasonTranslation,
    SeasonTranslationRequest,
    LanguageResponse,
} from "@/entities/types";
import { useSeasonTranslations } from "@/features/seasons/hooks/useSeasonTranslations";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import { useState } from "react";
import SeasonTranslationForm from "./SeasonTranslationForm";
import SeasonTranslationList from "./SeasonTranslationList";
import { useTranslations } from "next-intl";
import SeasonAiTranslationDialog from "@/features/seasons/components/translations/SeasonAiTranslationDialog";

interface Props {
    seasonId: number;
    languages: LanguageResponse[];
}

export default function SeasonTranslationsPanel({
    seasonId,
    languages,
}: Props) {

    const [translating, setTranslating] = useState(false);
    const [sourceTranslation, setSourceTranslation] = useState<SeasonTranslation | null>(null);
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
    } = useSeasonTranslations(seasonId);

    const [form, setForm] =
        useState<SeasonTranslationRequest>({
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
        translation: SeasonTranslation
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

    const handleEdit = (translation: SeasonTranslation) => {
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

    const t = useTranslations("seasons");

    return (
        <div className={layoutStyles.pageContainer}>

            <div className={layoutStyles.header}>
                <h1>{t("translations.title")}</h1>
            </div>

            <section className={layoutStyles.section}>

                <SeasonTranslationForm
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
                    <SeasonTranslationList
                        translations={translations}
                        deleting={deleting}
                        onDelete={deleteTranslation}
                        onEdit={handleEdit}
                        onTranslate={handleTranslate}
                    />
                )}

            </section>
            {sourceTranslation && (
                <SeasonAiTranslationDialog
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