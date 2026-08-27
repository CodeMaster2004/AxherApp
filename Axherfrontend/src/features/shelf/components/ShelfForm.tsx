"use client";

import { CreateShelf, LanguageResponse, ShelfLayout, ShelfSource, ShelfTarget } from "@/entities/types";
import BubbleToggle from "@/shared/components/ui/BubbleToggle";
import Button from "@/shared/components/ui/Button";
import Input from "@/shared/components/ui/Input";
import Select, { SelectOption } from "@/shared/components/ui/Select";
import { shelfLayoutOptions, shelfSourceOptions, shelfTargetOptions } from "@/shared/constants/selectOptions";
import styles from "@/shared/styles/shared/Form.module.css";
import { useTranslations } from "next-intl";

interface Props {
    value: CreateShelf;

    onChange: React.Dispatch<
        React.SetStateAction<CreateShelf>
    >;
    languages: LanguageResponse[];

    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;

    isEditing?: boolean;
    saving?: boolean;
    error?: string;

    onCancel?: () => void;
}

export default function ShelfForm({
    value,
    onChange,
    languages,

    onSubmit,

    isEditing = false,
    saving = false,
    error,

    onCancel
}: Props) {

    const common = useTranslations("common");
    const t = useTranslations("shelves");

    const languageOptions: SelectOption[] = languages.map(language => ({
        value: language.languageId,
        label: `${language.name} (${language.nativeName})`,
    }));

    const targetOptions = shelfTargetOptions.map(option => ({
        value: option.value,
        label: t(option.labelKey)
    }));

    const layoutOptions = shelfLayoutOptions.map(option => ({
        value: option.value,
        label: t(option.labelKey)
    }));

    const sourceOptions = shelfSourceOptions.map(option => ({
        value: option.value,
        label: t(option.labelKey)
    }));
    
    return (

        <form className={styles.form} onSubmit={onSubmit}>

            {error && (
                <p className={styles.errorMessage}>
                    {error}
                </p>
            )}

            <Input
                label={t("name")}
                value={value.name}
                onChange={(name) =>
                    onChange(prev => ({
                        ...prev,
                        name,
                    }))
                }
                placeholder={t("namePlaceholder")}
                required
                disabled={saving}
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
                placeholder={common("selectLanguage")}
                disabled={saving || isEditing}
            />

            <Select
                label={t("target")}
                value={value.target}
                onChange={(target) =>
                    onChange(prev => ({
                        ...prev,
                        target: target as ShelfTarget,
                    }))
                }
                options={targetOptions}
                disabled={saving}
            />

            <Select
                label={t("layout")}
                value={value.layout}
                onChange={(layout) =>
                    onChange(prev => ({
                        ...prev,
                        layout: layout as ShelfLayout,
                    }))
                }
                options={layoutOptions}
                disabled={saving}
            />

            <Select
                label={t("source")}
                value={value.source}
                onChange={(source) =>
                    onChange(prev => ({
                        ...prev,
                        source: source as ShelfSource,
                    }))
                }
                options={sourceOptions}
                disabled={saving}
            />


            <div className={styles.switchField}>

                <span>{common("active")}</span>

                <BubbleToggle
                    checked={value.active}
                    onChange={() =>
                        onChange(prev => ({
                            ...prev,
                            active: !prev.active,
                        }))
                    }
                    disabled={saving}
                />

            </div>

            <div className={styles.formActions}>
                    
                <Button
                    type="submit"
                    variant="animated"
                    loading={saving}
                    loadingText={
                        isEditing ? common("updating") : common("creating")
                    }
                >
                    {isEditing ? common("update") : common("create")}
                    
                </Button>
                {
                    onCancel && (
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onCancel}
                            disabled={saving}
                        >
                            {common("cancel")}
                        </Button>
                    )
                }
            </div>
        </form>
    )
}