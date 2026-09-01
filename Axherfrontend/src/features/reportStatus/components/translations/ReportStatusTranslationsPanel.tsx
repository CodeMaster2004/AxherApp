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
import ReportStatusAiTranslationDialog from "@/features/reportStatus/components/translations/ReportStatusAiTranslationDialog";

interface Props {
    statusId: number;
    languages: LanguageResponse[];
}

export default function ReportStatusTranslationsPanel({
    statusId,
    languages,
}: Props) {

    const t = useTranslations("reportStatus");
    const [translating, setTranslating] = useState(false);
    const [sourceTranslation, setSourceTranslation] = useState<ReportStatusTranslationResponse | null>(null);
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
    } = useReportStatusTranslations(statusId);

    const [form, setForm] =
        useState<ReportStatusTranslationRequest>({
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
        translation: ReportStatusTranslationResponse
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

        resetForm();
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
                        onTranslate={handleTranslate}
                    />
                )}

            </section>
            {sourceTranslation && (
                <ReportStatusAiTranslationDialog
                    open={aiDialogOpen}
                    sourceTranslation={sourceTranslation}
                    languages={languages}
                    onConfirm={handleAiTranslation}
                    onClose={handleCloseAiDialog}
                    translating={translating}
                />
            )}

        </div>
    );
}