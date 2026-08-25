"use client";

import formStyles from "@/shared/styles/shared/Form.module.css";
import Input from '@/shared/components/ui/Input';
import TextArea from '@/shared/components/ui/TextArea';
import Button from '@/shared/components/ui/Button';
import { ContentCategoryRequest, LanguageResponse } from "@/entities/types";
import Select, { SelectOption } from "@/shared/components/ui/Select";
import { useTranslations } from "next-intl";

interface Props {
  value: ContentCategoryRequest;
  onChange: React.Dispatch<
    React.SetStateAction<ContentCategoryRequest>>;
  languages: LanguageResponse[];
  onSubmit: (e: React.FormEvent) => void;
  isEditing: boolean;
  onCancel?: () => void;
  saving?: boolean;
}

export default function ContentCategoriesForm({
  value,
  onChange,
  languages,
  onSubmit,
  isEditing,
  onCancel,
  saving = false,
}: Props) {

    const common = useTranslations("common");
    const t = useTranslations("contentCategories");

    const languageOptions: SelectOption[] = languages.map(
        language => ({
            value: language.languageId,
            label: `${language.name} (${language.nativeName})`,
        })
    );
    return (
        
        <form onSubmit={onSubmit} className={formStyles.form}>
            
            <Input 
                label={common("name")}
                value={value.name}
                onChange={(name) =>
                        onChange(prev => ({
                            ...prev,
                            name,
                        }))
                    }
                placeholder={t("form.categoryNamePlaceholder")}
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
                placeholder={t("form.languagePlaceholder")}
                disabled={saving || isEditing}
            />
            
            <TextArea 
                label={common("description")}
                value={value.description}
                onChange={(description) =>
                        onChange(prev => ({
                            ...prev,
                            description,
                        }))
                    }
                placeholder={t("form.descriptionPlaceholder")}
                rows={4}
                required
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
