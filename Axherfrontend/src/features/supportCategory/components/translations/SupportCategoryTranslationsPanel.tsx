"use client";

import { LanguageResponse } from "@/entities/types";
import {
    SupportCategoryTranslationRequest,
    SupportCategoryTranslationResponse,
} from "@/entities/types/supportCategory.types";
import {
    useSupportCategoryTranslations,
} from "@/features/supportCategory/hooks/useSupportCategoryTranslations";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import { useState } from "react";
import SupportCategoryTranslationForm
    from "./SupportCategoryTranslationForm";
import SupportCategoryTranslationList
    from "./SupportCategoryTranslationList";
import { useTranslations } from "next-intl";


interface Props {
    categoryId: number;
    languages: LanguageResponse[];
}


export default function SupportCategoryTranslationsPanel({
    categoryId,
    languages,
}: Props) {

    const t = useTranslations("supportCategories");
    const {
        translations,
        loading,
        saving,
        deleting,
        error,
        saveTranslation,
        deleteTranslation,
    } = useSupportCategoryTranslations(categoryId);


    const [form, setForm] =
        useState<SupportCategoryTranslationRequest>({
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
        translation: SupportCategoryTranslationResponse
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

                <h1>
                    {t("translation.title")}
                </h1>

            </div>


            <section className={layoutStyles.section}>

                <SupportCategoryTranslationForm
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
                    {t("translation.registeredTitle")}
                </h2>


                {loading ? (

                    <p>
                        {t("translation.loading")}
                    </p>

                ) : (

                    <SupportCategoryTranslationList
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