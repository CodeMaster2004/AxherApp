"use client";

import { ContentShelfTranslationRequest, ContentShelfTranslationResponse, LanguageResponse } from "@/entities/types";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import { useState } from "react";
import ContentShelfTranslationForm from "./ContentShelfTranslationForm";
import ContentShelfTranslationList from "./ContentShelfTranslationList";
import { useContentShelfTranslations } from "@/features/shelf/hooks/useContentShelfTranslations";
import { useTranslations } from "next-intl";


interface Props {
    shelfId: number;
    languages: LanguageResponse[];
}


export default function ContentShelfTranslationsPanel({
    shelfId,
    languages,
}: Props) {

    const t = useTranslations("shelves");
    const {
        translations,
        loading,
        saving,
        deleting,
        error,
        saveTranslation,
        deleteTranslation,
    } = useContentShelfTranslations(
        shelfId
    );


    const [form, setForm] =
        useState<ContentShelfTranslationRequest>({
            languageId: 0,
            name: "",
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
        });
    };


    const handleEdit = (
        translation: ContentShelfTranslationResponse
    ) => {

        setEditingLanguageId(
            translation.languageId
        );

        setForm({
            languageId: translation.languageId,
            name: translation.name ?? "",
        });
    };


    const handleCancelEdit = () => {

        setEditingLanguageId(null);

        setForm({
            languageId: 0,
            name: "",
        });
    };


    return (
        <div className={layoutStyles.pageContainer}>

            <div className={layoutStyles.header}>
                <h1>
                    {t("translation.title")}
                </h1>
            </div>


            <section className={layoutStyles.section}>

                <ContentShelfTranslationForm
                    languages={languages}
                    value={form}
                    onChange={setForm}
                    onSubmit={handleSubmit}
                    saving={saving}
                    editing={
                        editingLanguageId !== null
                    }
                    onCancel={handleCancelEdit}
                />


                {Boolean(error) && (
                    <p role="alert">
                        {t("translation.error")}
                    </p>
                )}

            </section>


            <section className={layoutStyles.section}>

                <h2>
                    {t("translation.registered")}
                </h2>


                {loading ? (
                    <p>
                        {t("translation.loading")}
                    </p>
                ) : (
                    <ContentShelfTranslationList
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