"use client";

import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import { useState } from "react";
import ReportCategoryTranslationForm from "./ReportCategoryTranslationForm";
import ReportCategoryTranslationList from "./ReportCategoryTranslationList";
import { LanguageResponse, ReportCategoryTranslationRequest, ReportCategoryTranslationResponse } from "@/entities/types";
import { useReportCategoryTranslations } from "@/features/ReportCategory/hooks/useReportCategoryTranslations";
import ReportCategoryAiTranslationDialog from "@/features/ReportCategory/components/translations/ReportCategoryAiTranslationDialog";

interface Props {
    categoryId: number;
    languages: LanguageResponse[];
}


export default function ReportCategoryTranslationsPanel({
    categoryId,
    languages,
}: Props) {

    const [translating, setTranslating] = useState(false);
    const [sourceTranslation, setSourceTranslation] = useState<ReportCategoryTranslationResponse | null>(null);
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
    } = useReportCategoryTranslations(categoryId);


    const [form, setForm] =
        useState<ReportCategoryTranslationRequest>({
            languageId: 0,
            name: "",
            description: "",
        });

    const resetForm = () => {
        setForm({
            languageId: 0,
            name: "",
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
        translation: ReportCategoryTranslationResponse
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
                name: translated.translatedName,
                description:
                    translated.translatedDescription,
            });

            setAiDialogOpen(false);
            setSourceTranslation(null);
        } finally {
            setTranslating(false);
        }
    };

    const handleEdit = (
        translation: ReportCategoryTranslationResponse
    ) => {

        setEditingLanguageId(
            translation.languageId
        );


        setForm({

            languageId: translation.languageId,
            name: translation.name,
            description:
                translation.description ?? "",

        });

    };


    const handleCancelEdit = () => {

        resetForm();
    };


    return (

        <div className={layoutStyles.pageContainer}>

            <div className={layoutStyles.header}>

                <h1>Traducciones</h1>

            </div>


            <section className={layoutStyles.section}>

                <ReportCategoryTranslationForm

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
                        Ocurrió un error al procesar
                        la traducción.
                    </p>

                )}

            </section>

            <section className={layoutStyles.section}>
                <h2>
                    Traducciones registradas
                </h2>

                {loading ? (
                    <p>
                        Cargando traducciones...
                    </p>

                ) : (

                    <ReportCategoryTranslationList
                        translations={translations}
                        deleting={deleting}
                        onDelete={deleteTranslation}
                        onEdit={handleEdit}
                        onTranslate={handleTranslate}

                    />

                )}

            </section>
            {sourceTranslation && (
                <ReportCategoryAiTranslationDialog
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