"use client";

import { LanguageResponse } from "@/entities/types";
import {
    HeroBannerTranslationRequest,
    HeroBannerTranslationResponse,
} from "@/entities/types/heroBanner.types";
import {useHeroBannerTranslations,} from "@/features/heroBanner/hooks/useHeroBannerTranslations";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import { useState } from "react";
import HeroBannerTranslationForm from "./HeroBannerTranslationForm";
import HeroBannerTranslationList from "./HeroBannerTranslationList";
import { useTranslations } from "next-intl";
import HeroBannerAiTranslationDialog from "@/features/heroBanner/components/translations/HeroBannerAiTranslationDialog";


interface Props {
    heroBannerId: number;
    languages: LanguageResponse[];
}


export default function HeroBannerTranslationsPanel({
    heroBannerId,
    languages,
}: Props) {

    const [translating, setTranslating] = useState(false);
    const [sourceTranslation, setSourceTranslation] = useState<HeroBannerTranslationResponse | null>(null);
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
    } = useHeroBannerTranslations(
        heroBannerId
    );


    const [form, setForm] =
        useState<HeroBannerTranslationRequest>({
            languageId: 0,
            titleOverride: "",
            descriptionOverride: "",
        });

    const resetForm = () => {
        setForm({
            languageId: 0,
            titleOverride: "",
            descriptionOverride: "",
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
        translation: HeroBannerTranslationResponse
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
                titleOverride:
                    translated.translatedTitleOverride,
                descriptionOverride:
                    translated.translatedDescriptionOverride,
            });

            setAiDialogOpen(false);
            setSourceTranslation(null);
        } finally {
            setTranslating(false);
        }
    };

    const t = useTranslations("heroBanner");


    const handleEdit = (
        translation: HeroBannerTranslationResponse
    ) => {

        setEditingLanguageId(
            translation.languageId
        );

        setForm({
            languageId: translation.languageId,
            titleOverride:
                translation.titleOverride ?? "",
            descriptionOverride:
                translation.descriptionOverride ?? "",
        });
    };


    const handleCancelEdit = () => {

        resetForm();
    };


    return (

        <div className={layoutStyles.pageContainer}>

            <div className={layoutStyles.header}>

                <h1>
                    {t("list.translations")}
                </h1>

            </div>


            <section className={layoutStyles.section}>

                <HeroBannerTranslationForm
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
                        {t("translations.error")}
                    </p>

                )}

            </section>


            <section className={layoutStyles.section}>

                <h2>
                    {t("translations.registeredTitle")}
                </h2>


                {loading ? (

                    <p>
                        {t("translations.loading")}
                    </p>

                ) : (

                    <HeroBannerTranslationList
                        translations={translations}
                        deleting={deleting}
                        onDelete={deleteTranslation}
                        onEdit={handleEdit}
                        onTranslate={handleTranslate}
                    />

                )}

            </section>
            {sourceTranslation && (
                <HeroBannerAiTranslationDialog
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