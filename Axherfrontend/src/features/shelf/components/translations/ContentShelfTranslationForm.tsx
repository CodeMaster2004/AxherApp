"use client";

import { ContentShelfTranslationRequest, LanguageResponse } from "@/entities/types";
import Button from "@/shared/components/ui/Button";
import Input from "@/shared/components/ui/Input";
import Select, {SelectOption,} from "@/shared/components/ui/Select";
import formStyles from "@/shared/styles/shared/Form.module.css";
import { useTranslations } from "next-intl";

interface Props {
    languages: LanguageResponse[];

    value: ContentShelfTranslationRequest;

    onChange: (
        value: ContentShelfTranslationRequest
    ) => void;

    onSubmit: () => void;

    editing?: boolean;

    saving: boolean;

    onCancel: () => void;
}


export default function ContentShelfTranslationForm({
    languages,
    value,
    onChange,
    onSubmit,
    saving = false,
    editing = false,
    onCancel,
}: Props) {

    const common = useTranslations("common");
    const t = useTranslations("shelves");
    
    const languageOptions: SelectOption[] =
        languages.map(language => ({
            value: language.languageId,
            label:
                `${language.name} (${language.nativeName})`,
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
                placeholder={common("selectLanguage")}
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
                placeholder={t("namePlaceholder")}
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