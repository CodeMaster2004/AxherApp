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

interface Props {
    statusId: number;
    languages: LanguageResponse[];
}

export default function ContentStatusTranslationsPanel({
    statusId,
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
    } = useContentStatusTranslations(statusId);

    const [form, setForm] =
        useState<ContentStatusTranslationRequest>({
            languageId: 0,
            name: "",
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
            name: "",
            description: "",
        });
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

        setEditingLanguageId(null);

        setForm({
            languageId: 0,
            name: "",
            description: "",
        });
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
                    />
                )}

            </section>

        </div>
    );
}