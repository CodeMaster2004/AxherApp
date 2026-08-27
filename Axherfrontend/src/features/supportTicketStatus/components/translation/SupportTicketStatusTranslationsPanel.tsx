"use client";

import { LanguageResponse } from "@/entities/types";
import {
    SupportTicketStatusTranslationRequest,
    SupportTicketStatusTranslationResponse,
} from "@/entities/types/supportTicketStatus.types";
import {
    useSupportTicketStatusTranslations,
} from "@/features/supportTicketStatus/hooks/useSupportTicketStatusTranslations";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import { useState } from "react";
import SupportTicketStatusTranslationForm
    from "./SupportTicketStatusTranslationForm";
import SupportTicketStatusTranslationList
    from "./SupportTicketStatusTranslationList";
import { useTranslations } from "next-intl";

interface Props {
    statusId: number;
    languages: LanguageResponse[];
}

export default function SupportTicketStatusTranslationsPanel({
    statusId,
    languages,
}: Props) {

    const t = useTranslations("supportTicketStatus");

    const {
        translations,
        loading,
        saving,
        deleting,
        error,
        saveTranslation,
        deleteTranslation,
    } = useSupportTicketStatusTranslations(statusId);

    const [form, setForm] =
        useState<SupportTicketStatusTranslationRequest>({
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
        translation: SupportTicketStatusTranslationResponse
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

                <SupportTicketStatusTranslationForm
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
                        {t("error.translation")}
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
                    <SupportTicketStatusTranslationList
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
