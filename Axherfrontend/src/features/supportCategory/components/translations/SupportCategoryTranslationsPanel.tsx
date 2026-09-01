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
import SupportCategoryAiTranslationDialog from "@/features/supportCategory/components/translations/SupportCategoryAiTranslationDialog";


interface Props {
    categoryId: number;
    languages: LanguageResponse[];
}


export default function SupportCategoryTranslationsPanel({
    categoryId,
    languages,
}: Props) {

    const t = useTranslations("supportCategories");
    const [translating, setTranslating] = useState(false);
    const [sourceTranslation, setSourceTranslation] = useState<SupportCategoryTranslationResponse | null>(null);
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
    } = useSupportCategoryTranslations(categoryId);


    const [form, setForm] =
        useState<SupportCategoryTranslationRequest>({
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
    };


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
        translation: SupportCategoryTranslationResponse
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
                        onTranslate={handleTranslate}
                    />

                )}

            </section>
            {sourceTranslation && (
                <SupportCategoryAiTranslationDialog
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