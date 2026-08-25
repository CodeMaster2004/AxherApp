"use client";

import { LanguageResponse } from "@/entities/types";
import {HeroBannerTranslationRequest,} from "@/entities/types/heroBanner.types";
import Button from "@/shared/components/ui/Button";
import Input from "@/shared/components/ui/Input";
import Select, { SelectOption,} from "@/shared/components/ui/Select";
import TextArea from "@/shared/components/ui/TextArea";
import formStyles from "@/shared/styles/shared/Form.module.css";
import { useTranslations } from "next-intl";

interface Props {
    languages: LanguageResponse[];
    value: HeroBannerTranslationRequest;
    onChange: (
        value: HeroBannerTranslationRequest
    ) => void;
    onSubmit: () => void;
    editing?: boolean;
    saving: boolean;
    onCancel: () => void;
}


export default function HeroBannerTranslationForm({
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
            label:
                `${language.name} (${language.nativeName})`,
        }));

    const common = useTranslations("common");
    const t = useTranslations("heroBanner");

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
                label={common("title")}
                value={value.titleOverride}
                onChange={(val) =>
                    onChange({
                        ...value,
                        titleOverride: val,
                    })
                }
                placeholder={t("translations.titlePlaceholder")}
                disabled={saving}
            />


            <TextArea
                label={common("description")}
                value={value.descriptionOverride}
                onChange={(val) =>
                    onChange({
                        ...value,
                        descriptionOverride: val,
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
                        disabled={saving}
                    >
                        {common("cancel")}
                    </Button>
                )}

            </div>

        </div>
    );
}