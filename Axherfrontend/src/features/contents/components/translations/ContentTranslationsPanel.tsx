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

interface Props {
    contentId: number;
    languages: LanguageResponse[];
}

export default function ContentTranslationsPanel({
    contentId,
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
    } = useContentTranslations(contentId);

    const [form, setForm] =
        useState<ContentTranslationRequest>({
            languageId: 0,
            title: "",
            description: "",
        });
    const [editingLanguageId, setEditingLanguageId] = useState<number | null>(null);

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

    const handleEdit = (translation: ContentTranslation) => {

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

    const t = useTranslations("contents");

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
                    />
                )}

            </section>

        </div>
    );
}