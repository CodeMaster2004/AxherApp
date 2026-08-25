"use client";

import { LanguageResponse } from "@/entities/types";
import {
    ContentCategoryTranslationRequest,
} from "@/entities/types/category.types";
import Button from "@/shared/components/ui/Button";
import Input from "@/shared/components/ui/Input";
import Select, { SelectOption } from "@/shared/components/ui/Select";
import TextArea from "@/shared/components/ui/TextArea";
import formStyles from "@/shared/styles/shared/Form.module.css";
import { useTranslations } from "next-intl";

interface Props {
    languages: LanguageResponse[];
    value: ContentCategoryTranslationRequest;
    onChange: (
        value: ContentCategoryTranslationRequest
    ) => void;
    onSubmit: () => void;
    editing?: boolean;
    saving: boolean;
    onCancel: () => void;
}

export default function ContentCategoryTranslationForm({
    languages,
    value,
    onChange,
    onSubmit,
    saving = false,
    editing = false,
    onCancel,
}: Props) {

    const languageOptions: SelectOption[] =
        languages.map(language => ({
            value: language.languageId,
            label: `${language.name} (${language.nativeName})`,
        }));
    const common = useTranslations("common");
    const t = useTranslations("contentCategories");

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
                placeholder={t("translations.languagePlaceholder")}
                disabled={saving || editing}
            />

            <Input
                label={common("name")}
                value={value.name}
                onChange={(val) =>
                    onChange({
                        ...value,
                        name: val,
                    })
                }
                placeholder={t("translations.namePlaceholder")}
                disabled={saving}
            />

            <TextArea
                label={common("description")}
                value={value.description}
                onChange={(val) =>
                    onChange({
                        ...value,
                        description: val,
                    })
                }
                placeholder={t("translations.descriptionPlaceholder")}
                rows={4}
                disabled={saving}
            />

            <div>
                <Button
                    type="button"
                    variant="animated"
                    onClick={onSubmit}
                    disabled={saving}
                    loadingText={t("translations.saving")}
                >
                    {editing ? common("update") : common("create")}
                </Button>

                {editing && (
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

        </div>
    );
}