"use client";

import { ReportCategoryResponse } from "@/entities/types";
import Button from "@/shared/components/ui/Button";
import TextArea from "@/shared/components/ui/TextArea";
import styles from "@/shared/styles/shared/Form.module.css";
import { useTranslations } from "next-intl";

interface Props{
    reportCategoryId: number | "";
    setReportCategoryId: (value: number | "") => void;
    categories: ReportCategoryResponse[];
    description: string;
    setDescription: (value: string) => void;

    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;

    saving?: boolean;
    error?: string;
    onCancel?: () => void;
}

export default function ProblemReportForm({
    reportCategoryId,
    setReportCategoryId,
    categories,
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
            <h2>{t("report")}</h2>
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
                    value={reportCategoryId}
                    onChange={(e) =>
                        setReportCategoryId(
                            e.target.value === ""
                                ? ""
                                : Number(e.target.value)
                        )
                    }
                    disabled={saving}
                    required
                >
                    <option value="">
                        {t("form.categoryPlaceholder")}
                    </option>

                    {categories.map((category) => (
                        <option
                            key={category.reportCategoryId}
                            value={category.reportCategoryId}
                        >
                            {category.name}
                        </option>
                    ))}
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