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

interface Props {
    seasonId: number;
    languages: LanguageResponse[];
}

export default function SeasonTranslationsPanel({
    seasonId,
    languages,
}: Props) {
    const {
        translations,
        loading,
        saving,
        deleting,
        error,
        saveTranslation,
        deleteTranslation,
    } = useSeasonTranslations(seasonId);

    const [form, setForm] =
        useState<SeasonTranslationRequest>({
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

    const handleEdit = (translation: SeasonTranslation) => {
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
                    />
                )}

            </section>

        </div>
    );
}