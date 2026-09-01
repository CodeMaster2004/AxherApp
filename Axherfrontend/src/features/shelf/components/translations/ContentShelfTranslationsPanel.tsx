"use client";

import { ContentShelfTranslationRequest, ContentShelfTranslationResponse, LanguageResponse } from "@/entities/types";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import { useState } from "react";
import ContentShelfTranslationForm from "./ContentShelfTranslationForm";
import ContentShelfTranslationList from "./ContentShelfTranslationList";
import { useContentShelfTranslations } from "@/features/shelf/hooks/useContentShelfTranslations";
import { useTranslations } from "next-intl";
import ContentShelfAiTranslationDialog from "@/features/shelf/components/translations/ContentShelfAiTranslationDialog";


interface Props {
    shelfId: number;
    languages: LanguageResponse[];
}


export default function ContentShelfTranslationsPanel({
    shelfId,
    languages,
}: Props) {

    const t = useTranslations("shelves");
    const [translating, setTranslating] = useState(false);
    const [sourceTranslation, setSourceTranslation] = useState<ContentShelfTranslationResponse | null>(null);
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
    } = useContentShelfTranslations(
        shelfId
    );


    const [form, setForm] =
        useState<ContentShelfTranslationRequest>({
            languageId: 0,
            name: "",
        });

    const resetForm = () => {
        setForm({
            languageId: 0,
            name: "",
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
        translation: ContentShelfTranslationResponse
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
              
            });

            setAiDialogOpen(false);
            setSourceTranslation(null);
        } finally {
            setTranslating(false);
        }
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

        resetForm();
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
                        onTranslate={handleTranslate}
                    />
                )}

            </section>
            {sourceTranslation && (
                <ContentShelfAiTranslationDialog
                    open={aiDialogOpen}
                    sourceTranslation={
                        sourceTranslation
                    }
                    languages={languages}
                    onConfirm={
                        handleAiTranslation
                    }
                    onClose={handleCloseAiDialog}
                    translating={translating}
                />
            )}

        </div>
    );
}