"use client";

import {LanguageResponse,} from "@/entities/types";

import {
    ReportStatusTranslationRequest,
    ReportStatusTranslationResponse,
} from "@/entities/types/reportStatus.types";
import { useReportStatusTranslations,} from "@/features/reportStatus/hooks/useReportStatusTranslations";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import { useState } from "react";
import ReportStatusTranslationForm
    from "./ReportStatusTranslationForm";
import ReportStatusTranslationList
    from "./ReportStatusTranslationList";
import { useTranslations } from "next-intl";

interface Props {
    statusId: number;
    languages: LanguageResponse[];
}

export default function ReportStatusTranslationsPanel({
    statusId,
    languages,
}: Props) {

    const t = useTranslations("reportStatus");

    const {
        translations,
        loading,
        saving,
        deleting,
        error,
        saveTranslation,
        deleteTranslation,
    } = useReportStatusTranslations(statusId);

    const [form, setForm] =
        useState<ReportStatusTranslationRequest>({
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
        translation: ReportStatusTranslationResponse
    ) => {

        setEditingLanguageId(
            translation.languageId
        );

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

    return (
        <div className={layoutStyles.pageContainer}>

            <div className={layoutStyles.header}>
                <h1>{t("translations.title")}</h1>
            </div>

            <section className={layoutStyles.section}>

                <ReportStatusTranslationForm
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

                <h2>
                    {t("translations.registeredTitle")}
                </h2>

                {loading ? (
                    <p>
                        {t("translations.loading")}
                    </p>
                ) : (
                    <ReportStatusTranslationList
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