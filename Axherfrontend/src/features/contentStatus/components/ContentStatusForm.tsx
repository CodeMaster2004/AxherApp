"use client";

import formStyles from "@/shared/styles/shared/Form.module.css";
import Input from '@/shared/components/ui/Input';
import Button from '@/shared/components/ui/Button';
import Select, { SelectOption } from "@/shared/components/ui/Select";
import { ContentStatusRequest } from "@/entities/types/status.types";
import { LanguageResponse } from "@/entities/types";
import { useTranslations } from "next-intl";


interface Props {
    value: ContentStatusRequest;
    onChange: React.Dispatch<
        React.SetStateAction<ContentStatusRequest>
    >;
    languages: LanguageResponse[];
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    isEditing: boolean;
    onCancel?: () => void;
    saving?: boolean;
    error?: string;
}

export default function ContentStatusForm({
    value,
    onChange,
    onSubmit,
    isEditing,
    onCancel,
    saving = false,
    error,
    languages,
}: Props) {

    const languageOptions: SelectOption[] = languages.map(language => ({
        value: language.languageId,
        label: `${language.name} (${language.nativeName})`,
    }));

    const common = useTranslations("common");
   const t = useTranslations("contentStatus");
    
    return (
        
        <form onSubmit={onSubmit} className={formStyles.form}>
            {error && (
                <p className={formStyles.errorMessage}>
                {error}
                </p>
            )}
            <Input 
                label={t("form.codeLabel")}
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
                label={t("form.languageLabel")}
                options={languageOptions}
                value={value.languageId ?? ""}
                onChange={(languageId) =>
                    onChange(prev => ({
                        ...prev,
                        languageId: Number(languageId),
                    }))
                }
                placeholder={t("form.languagePlaceholder")}
                disabled={saving || isEditing}
            />

            <Input
                label={t("form.nameLabel")}
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

            <Input
                label={t("form.descriptionLabel")}
                value={value.description}
                onChange={(description) =>
                    onChange(prev => ({
                        ...prev,
                        description,
                    }))
                }
                placeholder={t("form.descriptionPlaceholder")}
                required={false} // opcional
                disabled={saving}
            />


            <div className={formStyles.formActions}>
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
    );
}