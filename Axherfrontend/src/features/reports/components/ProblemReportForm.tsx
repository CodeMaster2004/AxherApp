"use client";

import { ProblemReportCategory } from "@/entities/types/problemReport.types";
import Button from "@/shared/components/ui/Button";
import TextArea from "@/shared/components/ui/TextArea";
import { problemReportCategoryOptions } from "@/shared/constants/selectOptions";
import styles from "@/shared/styles/shared/Form.module.css";
import { useTranslations } from "next-intl";

interface Props{
    category: ProblemReportCategory | "";
    setCategory: (
        value: ProblemReportCategory | ""
    ) => void;

    description: string;
    setDescription: (value: string) => void;

    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;

    saving?: boolean;
    error?: string;
    onCancel?: () => void;
}

export default function ProblemReportForm({
    category,
    setCategory,
    description,
    setDescription,
    onSubmit,
    saving = false,
    error,
    onCancel
}: Props) {

    const common = useTranslations("common");
    const t = useTranslations("problemReport");

    return (

        <form onSubmit={onSubmit} className={styles.form}>
            <h2>{t("problemReport.report")}</h2>
            {error && (
                <p className={styles.errorMessage}>
                    {error}
                </p>
            )}

            <div className={styles.field}>
                <label htmlFor="problem-report-category">
                    {t("form.category")}
                </label>

                <select
                    id="problem-report-category"
                    className={styles.select}
                    value={category}
                    onChange={(e) =>
                        setCategory(
                            e.target.value as ProblemReportCategory
                        )
                    }
                    disabled={saving}
                    required
                >
                    <option value="">
                        {t("form.categoryPlaceholder")}
                    </option>

                    {problemReportCategoryOptions.map(
                        (option) => (
                            <option
                                key={option.value}
                                value={option.value}
                            >
                                {option.label}
                            </option>
                        )
                    )}
                </select>
            </div>

            <TextArea
                label={t("form.description")}
                value={description}
                onChange={setDescription}
                placeholder={t("form.descriptionPlaceholder")}
                rows={6}
                maxLength={1000}
                disabled={saving}
                required
            />
            <div className={styles.formActions}>
                <Button
                    type="submit"
                    variant="animated"
                    loading={saving}
                    loadingText={common("sending")}
                >
                    {t("form.send")}
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