"use client";

import Button from "@/shared/components/ui/Button";
import TextArea from "@/shared/components/ui/TextArea";
import styles from "@/shared/styles/shared/Form.module.css";
import { useTranslations } from "next-intl";
interface SupportCategoryOption {
    supportCategoryId: number;
    name: string;
}

interface Props {
    subject: string;
    setSubject: (value: string) => void;

    supportCategoryId: number | "";
    setSupportCategoryId: (value: number | "") => void;

    description: string;
    setDescription: (value: string) => void;

    categories: SupportCategoryOption[];

    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;

    saving?: boolean;
    error?: string;
    onCancel?: () => void;
}

export default function SupportTicketForm({
    subject,
    setSubject,
    supportCategoryId,
    setSupportCategoryId,
    description,
    setDescription,
    categories,
    onSubmit,
    saving = false,
    error,
    onCancel
}: Props) {

    const common = useTranslations("common");
    const t = useTranslations("supportTickets");

    return (
        <form onSubmit={onSubmit} className={styles.form}>
            <h2>{t("form.title")}</h2>

            {error && (
                <p className={styles.errorMessage}>
                    {error}
                </p>
            )}

            <div className={styles.field}>
                <label htmlFor="support-ticket-subject">
                    {t("form.subjectLabel")}
                </label>

                <input
                    id="support-ticket-subject"
                    className={styles.input}
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder={t("form.subjectPlaceholder")}
                    maxLength={150}
                    disabled={saving}
                    required
                />

            </div>
            <div className={styles.field}>
                <label htmlFor="support-ticket-category">
                    {t("form.categoryLabel")}
                </label>

                <select
                    id="support-ticket-category"
                    className={styles.select}
                    value={supportCategoryId}
                    onChange={(e) =>
                        setSupportCategoryId(
                            e.target.value
                                ? Number(e.target.value)
                                : ""
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
                            key={category.supportCategoryId}
                            value={category.supportCategoryId}
                        >
                            {category.name}
                        </option>
                    ))}

                </select>

            </div>

            <TextArea
                label={t("form.descriptionLabel")}
                value={description}
                onChange={setDescription}
                placeholder={t("form.descriptionPlaceholder")}
                rows={6}
                maxLength={2000}
                disabled={saving}
                required
            />

            <div>
                <Button
                    type="submit"
                    variant="animated"
                    loading={saving}
                    loadingText={t("form.creating")}
                >
                    {t("form.create")}
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