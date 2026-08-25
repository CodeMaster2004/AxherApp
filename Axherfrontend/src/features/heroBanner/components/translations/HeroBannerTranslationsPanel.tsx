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


interface Props {
    heroBannerId: number;
    languages: LanguageResponse[];
}


export default function HeroBannerTranslationsPanel({
    heroBannerId,
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
    } = useHeroBannerTranslations(
        heroBannerId
    );


    const [form, setForm] =
        useState<HeroBannerTranslationRequest>({
            languageId: 0,
            titleOverride: "",
            descriptionOverride: "",
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
            titleOverride: "",
            descriptionOverride: "",
        });
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

        setEditingLanguageId(null);

        setForm({
            languageId: 0,
            titleOverride: "",
            descriptionOverride: "",
        });
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
                    />

                )}

            </section>

        </div>

    );
}