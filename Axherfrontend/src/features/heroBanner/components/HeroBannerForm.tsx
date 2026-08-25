"use client";
import { HeroBannerRequest, LanguageResponse } from "@/entities/types";
import Button from "@/shared/components/ui/Button";
import ContentSelector from "@/shared/components/ui/ContentSelector";
import FileInput from "@/shared/components/ui/FileInput";
import FilePreviewOrLink from "@/shared/components/ui/FilePreviewOrLink";
import Input from "@/shared/components/ui/Input";
import Select, { SelectOption } from "@/shared/components/ui/Select";
import TextArea from "@/shared/components/ui/TextArea";
import styles from "@/shared/styles/shared/Form.module.css";
import { useTranslations } from "next-intl";

interface Props {
    
    value: HeroBannerRequest;
    onChange: React.Dispatch<
        React.SetStateAction<HeroBannerRequest>
    >;
    languages: LanguageResponse[];
    backdropFile: File | null;
    backdropUrl?: string;
    setBackdropFile:(file: File | null) => void;
    onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
    isEditing?:boolean;
    saving?:boolean;
    error?:string;
    onCancel?:()=>void;

}

export default function HeroBannerForm({
    value,
    onChange,
    languages,
    backdropUrl,
    backdropFile,
    setBackdropFile,
    onSubmit,
    isEditing,
    saving = false,
    error,
    onCancel

}: Props){

    const languageOptions: SelectOption[] = languages.map(language => ({
        value: language.languageId,
        label: `${language.name} (${language.nativeName})`,
    }));

    const common = useTranslations("common");
    const t = useTranslations("heroBanner");
    
    return (
        <form className={styles.form} onSubmit={onSubmit}>

            {error && (
                <p className={styles.errorMessage}>
                    {error}
                </p>
            )}

            <ContentSelector
                value={value.contentId}
                onChange={(contentId) =>
                    onChange(prev => ({
                        ...prev,
                        contentId,
                    }))
                }
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
                label={t("titleOverride")}
                value={value.titleOverride ?? ""}
                onChange={(titleOverride) =>
                    onChange(prev => ({
                        ...prev,
                        titleOverride,
                    }))
                }
                placeholder={t("titleOverridePlaceholder")}
                disabled={saving}
            />

            <TextArea
                label={t("descriptionOverride")}
                value={value.descriptionOverride ?? ""}
                onChange={(descriptionOverride) =>
                    onChange(prev => ({
                        ...prev,
                        descriptionOverride,
                    }))
                }
                placeholder={t("descriptionOverridePlaceholder")}
                rows={4}
                disabled={saving}
            />

            <Input
                label={t("priority")}
                type="number"
                value={(value.priority ?? 0).toString()}
                onChange={(priority) =>
                    onChange(prev => ({
                        ...prev,
                        priority: Number(priority),
                    }))
                }
                min={0}
                disabled={saving}
            />

            <FileInput
                label={t("backdrop")}
                accept="image/*"
                onChange={setBackdropFile}
                disabled={saving}
            />

            {
                !backdropFile && backdropUrl && (
                    <FilePreviewOrLink
                        url={backdropUrl}
                        type="image"
                        label={t("currentBackdrop")}
                        file={null}
                    />
                )
            }

            <Input
                label={t("startDate")}
                type="datetime-local"
                value={value.startDate ?? ""}
                onChange={(startDate) =>
                    onChange(prev => ({
                        ...prev,
                        startDate,
                    }))
                }
                disabled={saving}
            />

            <Input
                label={t("endDate")}
                type="datetime-local"
                value={value.endDate ?? ""}
                onChange={(endDate) =>
                    onChange(prev => ({
                        ...prev,
                        endDate,
                    }))
                }
                disabled={saving}
            />

            <label>
                <input
                    type="checkbox"
                    checked={value.active}
                    onChange={(e) =>
                        onChange(prev => ({
                            ...prev,
                            active: e.target.checked,
                        }))
                    }
                    disabled={saving}
                />
                {t("active")}
            </label>
                
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
                    {
                        isEditing
                        ? common("update")
                        : common("create")
                    }
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