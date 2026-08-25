"use client";


import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import { useState } from "react";
import ContentCategoryTranslationForm from "./ContentCategoryTranslationForm";
import ContentCategoryTranslationList from "./ContentCategoryTranslationList";
import { LanguageResponse } from "@/entities/types";
import {
    ContentCategoryTranslationRequest,
    ContentCategoryTranslationResponse,
} from "@/entities/types/category.types";
import { useContentCategoryTranslations } from "@/features/contentCategories/hooks/useContentCategoryTranslations";
import { useTranslations } from "next-intl";

interface Props {
    categoryId: number;
    languages: LanguageResponse[];
}

export default function ContentCategoryTranslationsPanel({
    categoryId,
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
    } = useContentCategoryTranslations(categoryId);

    const [form, setForm] =
        useState<ContentCategoryTranslationRequest>({
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
        translation: ContentCategoryTranslationResponse
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

    const t = useTranslations("contentCategories");
    
    return (
        <div className={layoutStyles.pageContainer}>

            <div className={layoutStyles.header}>
                <h1>{t("translations.title")}</h1>
            </div>

            <section className={layoutStyles.section}>

                <ContentCategoryTranslationForm
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
                    <ContentCategoryTranslationList
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
