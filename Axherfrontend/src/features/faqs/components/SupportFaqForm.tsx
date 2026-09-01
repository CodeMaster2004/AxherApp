"use client";

import {
    LanguageResponse,
    SupportCategoryResponse,
} from "@/entities/types";

import {
    SupportFaqRequest,
} from "@/entities/types/supportFaq.types";

import BubbleToggle from "@/shared/components/ui/BubbleToggle";
import Button from "@/shared/components/ui/Button";
import Input from "@/shared/components/ui/Input";
import Select, {
    SelectOption,
} from "@/shared/components/ui/Select";
import TextArea from "@/shared/components/ui/TextArea";

import styles from "@/shared/styles/shared/Form.module.css";

import { useTranslations } from "next-intl";

interface Props {
    value: SupportFaqRequest;
    onChange: React.Dispatch<
        React.SetStateAction<SupportFaqRequest>
    >;
    languages: LanguageResponse[];
    categories: SupportCategoryResponse[];
    onSubmit: (
        e: React.FormEvent<HTMLFormElement>
    ) => void;
    isEditing?: boolean;
    saving?: boolean;
    error?: string;
    onCancel?: () => void;
}

export default function SupportFaqForm({
    value,
    onChange,
    languages,
    categories,
    onSubmit,
    isEditing = false,
    saving = false,
    error,
    onCancel,
}: Props) {

    const common = useTranslations("common");
    const t = useTranslations("supportFaq");

    const languageOptions: SelectOption[] =
        languages.map(language => ({
            value: language.languageId,
            label: `${language.name} (${language.nativeName})`,
        }));

    const categoryOptions: SelectOption[] =
        categories.map(category => ({
            value: category.supportCategoryId,
            label: category.name,
        }));

    return (
        <form
            className={styles.form}
            onSubmit={onSubmit}
        >
            {error && (
                <p className={styles.errorMessage}>
                    {error}
                </p>
            )}

            {/* =========================
                CATEGORY
            ========================= */}

            <Select
                label={t("form.category")}
                options={categoryOptions}
                value={value.supportCategoryId ?? ""}
                onChange={(supportCategoryId) =>
                    onChange(prev => ({
                        ...prev,
                        supportCategoryId:
                            Number(supportCategoryId),
                    }))
                }
                placeholder={t("form.selectCategory")}
                disabled={saving}
                required
            />

            {/* =========================
                LANGUAGE
            ========================= */}

            <Select
                label={t("form.language")}
                options={languageOptions}
                value={value.languageId ?? ""}
                onChange={(languageId) =>
                    onChange(prev => ({
                        ...prev,
                        languageId:
                            Number(languageId),
                    }))
                }
                placeholder={t("form.selectLanguage")}
                disabled={saving || isEditing}
                required
            />

            {/* =========================
                QUESTION
            ========================= */}

            <Input
                label={t("form.question")}
                value={value.question}
                onChange={(question) =>
                    onChange(prev => ({
                        ...prev,
                        question,
                    }))
                }
                placeholder={t("form.question")}
                maxLength={255}
                required
                disabled={saving}
                autoFocus={!isEditing}
            />

            {/* =========================
                ANSWER
            ========================= */}

            <TextArea
                label={t("form.answer")}
                value={value.answer}
                onChange={(answer) =>
                    onChange(prev => ({
                        ...prev,
                        answer,
                    }))
                }
                placeholder={t("form.answer")}
                rows={6}
                required
                disabled={saving}
            />

            {/* =========================
                DISPLAY ORDER
            ========================= */}

            <Input
                label={t("form.displayOrder")}
                type="number"
                value={
                    value.displayOrder !== undefined
                        ? String(value.displayOrder)
                        : ""
                }
                onChange={(displayOrder) =>
                    onChange(prev => ({
                        ...prev,
                        displayOrder:
                            displayOrder === ""
                                ? undefined
                                : Number(displayOrder),
                    }))
                }
                min={0}
                required
                disabled={saving}
            />
            {/* =========================
                ACTIVE
            ========================= */}

            <div className={styles.switchField}>
                <span>
                    {common("active")}
                </span>

                <BubbleToggle
                    checked={value.active ?? false}
                    onChange={() =>
                        onChange(prev => ({
                            ...prev,
                            active: !prev.active,
                        }))
                    }
                    disabled={saving}
                />
            </div>

            {/* =========================
                ACTIONS
            ========================= */}

            <div className={styles.formActions}>
                <Button
                    type="submit"
                    variant="animated"
                    loading={saving}
                    loadingText={
                        isEditing
                            ? common("updating")
                            : common("creating")
                    }
                >
                    {isEditing
                        ? common("update")
                        : common("create")}
                </Button>

                {onCancel && (
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onCancel}
                        disabled={saving}
                    >
                        {common("cancel")}
                    </Button>
                )}
            </div>
        </form>
    );
}
