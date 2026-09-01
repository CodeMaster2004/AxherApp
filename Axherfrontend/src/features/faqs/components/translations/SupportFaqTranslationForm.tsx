"use client";

import { LanguageResponse } from "@/entities/types";

import {
    SupportFaqTranslationRequest,
} from "@/entities/types/supportFaq.types";

import Button from "@/shared/components/ui/Button";
import Select, {
    SelectOption,
} from "@/shared/components/ui/Select";
import Input from "@/shared/components/ui/Input";
import TextArea from "@/shared/components/ui/TextArea";

import formStyles from "@/shared/styles/shared/Form.module.css";

import { useTranslations } from "next-intl";

interface Props {
    languages: LanguageResponse[];
    value: SupportFaqTranslationRequest;
    onChange: (
        value: SupportFaqTranslationRequest
    ) => void;
    onSubmit: () => void;
    editing?: boolean;
    saving: boolean;
    translating?: boolean;
    onCancel: () => void;
}

export default function SupportFaqTranslationForm({
    languages,
    value,
    onChange,
    onSubmit,
    editing = false,
    saving = false,
    translating = false,
    onCancel,
}: Props) {

    const common = useTranslations("common");
    const t = useTranslations("supportFaq");

    const languageOptions: SelectOption[] =
        languages.map(language => ({
            value: language.languageId,
            label: `${language.name} (${language.nativeName})`,
        }));

    return (
        <div className={formStyles.form}>

            <Select
                label={common("language")}
                options={languageOptions}
                value={value.languageId}
                onChange={(val) =>
                    onChange({
                        ...value,
                        languageId: Number(val),
                    })
                }
                placeholder={common("languagePlaceholder")}
                disabled={saving || editing || translating}
            />

            <Input
                label={t("translations.question")}
                value={value.question}
                onChange={(val) =>
                    onChange({
                        ...value,
                        question: val,
                    })
                }
                placeholder={t(
                    "translations.questionPlaceholder"
                )}
                disabled={saving || translating}
            />

            <TextArea
                label={t("translations.answer")}
                value={value.answer}
                onChange={(val) =>
                    onChange({
                        ...value,
                        answer: val,
                    })
                }
                placeholder={t(
                    "translations.answerPlaceholder"
                )}
                rows={5}
                disabled={saving || translating}
            />

            <div>
                <Button
                    type="button"
                    variant="animated"
                    onClick={onSubmit}
                    disabled={saving || translating || !value.languageId}
                    loadingText={common("saving")}
                >
                    {editing
                        ? common("update")
                        : common("save")}
                </Button>

                {editing && (
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onCancel}
                        disabled={saving || translating}
                    >
                        {common("cancel")}
                    </Button>
                )}
            </div>

        </div>
    );
}