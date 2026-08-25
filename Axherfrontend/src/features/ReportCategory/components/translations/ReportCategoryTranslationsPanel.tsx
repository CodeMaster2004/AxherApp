"use client";

import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import { useState } from "react";
import ReportCategoryTranslationForm from "./ReportCategoryTranslationForm";
import ReportCategoryTranslationList from "./ReportCategoryTranslationList";
import { LanguageResponse, ReportCategoryTranslationRequest, ReportCategoryTranslationResponse } from "@/entities/types";
import { useReportCategoryTranslations } from "@/features/ReportCategory/hooks/useReportCategoryTranslations";

interface Props {
    categoryId: number;
    languages: LanguageResponse[];
}


export default function ReportCategoryTranslationsPanel({
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
    } = useReportCategoryTranslations(categoryId);


    const [form, setForm] =
        useState<ReportCategoryTranslationRequest>({
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

        setEditingLanguageId(null);

        setForm({

            languageId: 0,
            name: "",
            description: "",

        });

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

                    />

                )}

            </section>

        </div>

    );

}