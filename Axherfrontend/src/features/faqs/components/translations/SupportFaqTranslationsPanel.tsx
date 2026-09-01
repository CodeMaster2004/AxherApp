"use client";

import {LanguageResponse,} from "@/entities/types";
import {SupportFaqTranslationRequest, SupportFaqTranslationResponse,} from "@/entities/types/supportFaq.types";
import {useSupportFaqTranslations,} from "@/features/faqs/hooks/useSupportFaqTranslations";
import SupportFaqTranslationForm from "./SupportFaqTranslationForm";
import SupportFaqTranslationList from "./SupportFaqTranslationList";
import { useState } from "react";
import { useTranslations } from "next-intl";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import SupportFaqAiTranslationDialog from "@/features/faqs/components/translations/SupportFaqAiTranslationDialog";


interface Props {
    faqId: number;
    languages: LanguageResponse[];
}

export default function SupportFaqTranslationsPanel({
    faqId,
    languages,
}: Props) {

    const t = useTranslations("supportFaq");
    const [translating, setTranslating] = useState(false);
    const [sourceTranslation, setSourceTranslation] = useState<SupportFaqTranslationResponse | null>(null);
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
    } = useSupportFaqTranslations(faqId);

    const [form, setForm] =
        useState<SupportFaqTranslationRequest>({
            languageId: 0,
            question: "",
            answer: "",
        });

    const resetForm = () => {
        setForm({
            languageId: 0,
            question: "",
            answer: "",
        });

        setEditingLanguageId(null);
    };


    const [
        editingLanguageId,
        setEditingLanguageId,
    ] = useState<number | null>(null);

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
        translation: SupportFaqTranslationResponse
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
                question:
                    translated.translatedQuestion,
                answer:
                    translated.translatedAnswer,
            });

            setAiDialogOpen(false);
            setSourceTranslation(null);
        } finally {
            setTranslating(false);
        }
    };

    const handleEdit = (
        translation: SupportFaqTranslationResponse
    ) => {

        setEditingLanguageId(
            translation.languageId
        );

        setForm({
            languageId: translation.languageId,
            question: translation.question,
            answer: translation.answer,
        });
    };

    const handleCancelEdit = () => {

        resetForm();
    };

    return (
        <div className={layoutStyles.pageContainer}>

            <div className={layoutStyles.header}>
                <h1>
                    {t("translations.title")}
                </h1>

                <p>
                    {t(
                        "translations.description"
                    )}
                </p>
            </div>

            <section className={layoutStyles.section}>
                <SupportFaqTranslationForm
                    languages={languages}
                    value={form}
                    onChange={setForm}
                    onSubmit={handleSubmit}
                    saving={saving}
                    translating={translating}
                    editing={
                        editingLanguageId !== null
                    }
                    onCancel={handleCancelEdit}
                />

                {Boolean(error) && (
                    <p role="alert">
                        {t(
                            "translations.error"
                        )}
                    </p>
                )}
            </section>

            <section className={layoutStyles.section}>
                <h2>
                    {t(
                        "translations.registeredTitle"
                    )}
                </h2>

                {loading ? (
                    <p>
                        {t(
                            "translations.loading"
                        )}
                    </p>
                ) : (
                    <SupportFaqTranslationList
                        translations={
                            translations
                        }
                        deleting={deleting}
                        onDelete={
                            deleteTranslation
                        }
                        onEdit={handleEdit}
                        onTranslate={handleTranslate}
                    />
                )}
            </section>

            {sourceTranslation && (
                <SupportFaqAiTranslationDialog
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