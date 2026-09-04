"use client";

import { CinematicRoleTranslationRequest, CinematicRoleTranslationResponse, LanguageResponse } from "@/entities/types";
import {useCinematicRoleTranslations,} from "@/features/cinematicRole/hooks/useCinematicRoleTranslations";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import { useState } from "react";
import CinematicRoleTranslationForm from "./CinematicRoleTranslationForm";
import CinematicRoleTranslationList from "./CinematicRoleTranslationList";
import CinematicRoleAiTranslationDialog from "@/features/cinematicRole/components/translations/CinematicRoleAiTranslationDialog";
import { useTranslations } from "next-intl";

interface Props {
    roleId: number;
    languages: LanguageResponse[];
}

export default function CinematicRoleTranslationsPanel({
    roleId,
    languages,
}: Props) {

    const t = useTranslations("cinematicRole");

    const [translating, setTranslating] =
        useState(false);

    const [
        sourceTranslation,
        setSourceTranslation
    ] = useState<CinematicRoleTranslationResponse | null>(
        null
    );

    const [aiDialogOpen, setAiDialogOpen] =
        useState(false);

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
    } = useCinematicRoleTranslations(roleId);

    const [form, setForm] =
        useState<CinematicRoleTranslationRequest>({
            languageId: 0,
            name: "",
            description: "",
        });

    const [
        editingLanguageId,
        setEditingLanguageId
    ] = useState<number | null>(null);

    const resetForm = () => {

        setForm({
            languageId: 0,
            name: "",
            description: "",
        });

        setEditingLanguageId(null);
    };

    const handleSubmit = async () => {

        if (!form.languageId) {
            return;
        }

        if (editingLanguageId !== null) {

            await updateTranslation(
                editingLanguageId,
                form
            );

        } else {

            await createTranslation(form);
        }

        resetForm();
    };

    const handleTranslate = (
        translation: CinematicRoleTranslationResponse
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

            const translated =
                await translateWithAi(
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
        translation: CinematicRoleTranslationResponse
    ) => {

        setEditingLanguageId(
            translation.languageId
        );

        setForm({
            languageId:
                translation.languageId,

            name:
                translation.name,

            description:
                translation.description ?? "",
        });
    };

    const handleCancelEdit = () => {
        resetForm();
    };

    return (
        <div
            className={
                layoutStyles.pageContainer
            }
        >

            <div
                className={layoutStyles.header}
            >

                <h1>
                    {t("translations.title")}
                </h1>

            </div>

            <section
                className={layoutStyles.section}
            >

                <CinematicRoleTranslationForm
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
                        {t("errors.translation")}
                    </p>
                )}

            </section>

            <section
                className={layoutStyles.section}
            >

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

                    <CinematicRoleTranslationList
                        translations={translations}
                        deleting={deleting}
                        onDelete={deleteTranslation}
                        onEdit={handleEdit}
                        onTranslate={handleTranslate}
                    />

                )}

            </section>

            {sourceTranslation && (

                <CinematicRoleAiTranslationDialog
                    open={aiDialogOpen}
                    sourceTranslation={
                        sourceTranslation
                    }
                    languages={languages}
                    onConfirm={
                        handleAiTranslation
                    }
                    onClose={
                        handleCloseAiDialog
                    }
                    translating={translating}
                />

            )}

        </div>
    );
}