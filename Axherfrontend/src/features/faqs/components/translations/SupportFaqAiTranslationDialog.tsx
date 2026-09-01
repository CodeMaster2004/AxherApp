"use client";

import { LanguageResponse } from "@/entities/types";
import {
    SupportFaqTranslationResponse,
} from "@/entities/types/supportFaq.types";

import Button from "@/shared/components/ui/Button";
import Select, {
    SelectOption,
} from "@/shared/components/ui/Select";
import Modal from "@/shared/components/ui/Modal";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface Props {
    open: boolean;
    sourceTranslation: SupportFaqTranslationResponse;
    languages: LanguageResponse[];
    onConfirm: (targetLanguageId: number) => void;
    onClose: () => void;
    translating?: boolean;
}

export default function SupportFaqAiTranslationDialog({
    open,
    sourceTranslation,
    languages,
    onConfirm,
    onClose,
    translating = false,
}: Props) {
    const common = useTranslations("common");

    const [targetLanguageId, setTargetLanguageId] =
        useState<number>(0);

    const languageOptions: SelectOption[] =
        languages
            .filter(
                language =>
                    language.languageId !==
                    sourceTranslation.languageId
            )
            .map(language => ({
                value: language.languageId,
                label: `${language.name} (${language.nativeName})`,
            }));

    const handleClose = () => {
        if (translating) {
            return;
        }

        setTargetLanguageId(0);
        onClose();
    };

    const handleConfirm = () => {
        if (!targetLanguageId) {
            return;
        }

        onConfirm(targetLanguageId);
    };

    return (
        <Modal
            open={open}
            title={common("translateWithAi")}
            onClose={handleClose}
        >
            <div>
                <Select
                    label={common("language")}
                    options={languageOptions}
                    value={targetLanguageId}
                    onChange={val =>
                        setTargetLanguageId(Number(val))
                    }
                    placeholder={common(
                        "languagePlaceholder"
                    )}
                    disabled={translating}
                />

                <div>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleClose}
                        disabled={translating}
                    >
                        {common("cancel")}
                    </Button>

                    <Button
                        type="button"
                        variant="animated"
                        onClick={handleConfirm}
                        disabled={
                            !targetLanguageId ||
                            translating
                        }
                        loadingText={
                            common("translating")
                        }
                    >
                        {common("translateWithAi")}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}