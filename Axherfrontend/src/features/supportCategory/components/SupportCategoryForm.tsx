"use client";

import { LanguageResponse, SupportCategoryRequest } from "@/entities/types";
import Button from "@/shared/components/ui/Button";
import Input from "@/shared/components/ui/Input";
import Select, { SelectOption } from "@/shared/components/ui/Select";
import TextArea from "@/shared/components/ui/TextArea";
import styles from "@/shared/styles/shared/Form.module.css"
import { useTranslations } from "next-intl";

interface Props {
    value: SupportCategoryRequest;
    onChange: React.Dispatch<
        React.SetStateAction<SupportCategoryRequest>
    >;
    languages: LanguageResponse[];
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    isEditing: boolean;
    onCancel?: () => void;
    saving?: boolean;
    error?: string;
}

export default function SupportCategoryForm({
    value,
    onChange,
    languages,
    onSubmit,
    isEditing,
    onCancel,
    saving = false,
    error,
}: Props) {

    const common = useTranslations("common");
    const t = useTranslations("supportCategory");

    const languageOptions: SelectOption[] = languages.map(language => ({
        value: language.languageId,
        label: `${language.name} (${language.nativeName})`,
    }));
    
    return (
        <form onSubmit={onSubmit} className={styles.form}>

            {error && (
                <p className={styles.errorMessage}>
                {error}
                </p>
            )}

            <Input
                label={t("form.code")}
                value={value.code}
                onChange={(code) =>
                    onChange(prev => ({
                        ...prev,
                        code,
                    }))
                }
                placeholder={t("form.codePlaceholder")}
                maxLength={20}
                required
                disabled={saving}
                autoFocus={!isEditing}
            />

            <Select
                label={common("language")}
                options={languageOptions}
                value={value.languageId ?? ""}
                onChange={(languageId) =>
                    onChange(prev => ({
                        ...prev,
                        languageId: Number(languageId),
                    }))
                }
                placeholder={common("languagePlaceholder")}
                disabled={saving || isEditing}
            />

            <Input
                label={t("form.name")}
                value={value.name}
                onChange={(name) =>
                    onChange(prev => ({
                        ...prev,
                        name,
                    }))
                }
                placeholder={t("form.namePlaceholder")}
                maxLength={50}
                required
                disabled={saving}
                autoFocus={isEditing}
            />

            <TextArea
                label={t("form.description")}
                value={value.description}
                onChange={(description) =>
                    onChange(prev => ({
                        ...prev,
                        description,
                    }))
                }
                placeholder={t("form.descriptionPlaceholder")}
                rows={4}
                disabled={saving}
            />

            <div className={styles.formActions}>

                <Button
                    type="submit"
                    variant="animated"
                    loading={saving}
                    loadingText={isEditing ? common("updating") : common("creating")}
                >
                    {isEditing ? common("update") : common("create")}
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
    )
}