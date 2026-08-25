"use client";

import {
    EpisodeTranslation,
    EpisodeTranslationRequest,
    LanguageResponse,
} from "@/entities/types";
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
    const {
        translations,
        loading,
        saving,
        deleting,
        error,
        saveTranslation,
        deleteTranslation,
    } = useEpisodeTranslations(episodeId);

    const [form, setForm] =
        useState<EpisodeTranslationRequest>({
            languageId: 0,
            title: "",
            description: "",
        });

    const [editingLanguageId, setEditingLanguageId] =
        useState<number | null>(null);

    const handleSubmit = async () => {
        if (!form.languageId) {
            return;
        }

        await saveTranslation(form);

        setEditingLanguageId(null);

        setForm({
            languageId: 0,
            title: "",
            description: "",
        });
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
        setEditingLanguageId(null);

        setForm({
            languageId: 0,
            title: "",
            description: "",
        });
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
                    />
                )}

            </section>

        </div>
    );
}