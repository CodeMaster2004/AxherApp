"use client";

import {
    EpisodeTranslation,
    EpisodeTranslationRequest,
    LanguageResponse,
} from "@/entities/types";
import EpisodeAiTranslationDialog from "@/features/episodes/components/translations/EpisodeAiTranslationDialog";
import EpisodeTranslationForm from "@/features/episodes/components/translations/EpisodeTranslationForm";
import EpisodeTranslationList from "@/features/episodes/components/translations/EpisodeTranslationList";
import { useEpisodeTranslations } from "@/features/episodes/hooks/useEpisodeTranslations";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import { useTranslations } from "next-intl";
import { useState } from "react";


interface Props {
    episodeId: number;
    languages: LanguageResponse[];
}

export default function EpisodeTranslationsPanel({
    episodeId,
    languages,
}: Props) {
    const t = useTranslations("episodes");
    const [translating, setTranslating] = useState(false);
    const [sourceTranslation, setSourceTranslation] = useState<EpisodeTranslation | null>(null);
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
    } = useEpisodeTranslations(episodeId);

    const [form, setForm] =
        useState<EpisodeTranslationRequest>({
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
        translation: EpisodeTranslation
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

    const handleEdit = (translation: EpisodeTranslation) => {
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

                <EpisodeTranslationForm
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
                        {t("errors.load")}
                    </p>
                )}

            </section>

            <section className={layoutStyles.section}>

                <h2>{t("translations.registeredTitle")}</h2>

                {loading ? (
                    <p>{t("translations.loading")}</p>
                ) : (
                    <EpisodeTranslationList
                        translations={translations}
                        deleting={deleting}
                        onDelete={deleteTranslation}
                        onEdit={handleEdit}
                        onTranslate={handleTranslate}
                    />
                )}

            </section>
            {sourceTranslation && (
                <EpisodeAiTranslationDialog
                    open={aiDialogOpen}
                    sourceTranslation={sourceTranslation}
                    languages={languages}
                    onConfirm={handleAiTranslation}
                    translating={translating}
                    onClose={handleCloseAiDialog}
                />
            )}

        </div>
    );
}