"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import { ReportCategoryRequest } from "@/entities/types";
import { useLanguage } from "@/features/language/hooks/useLanguage";
import { useReportCategoryActions } from "@/features/ReportCategory/hooks/useReportCategoryActions";
import ReportCategoryForm from "@/features/ReportCategory/components/ReportCategoryForm";
import { useTranslations } from "next-intl";

export default function CreateReportCategoryPage() {

    const router = useRouter();

    const [error, setError] = useState("");
    const t = useTranslations("reportCategory");
    const [form, setForm] = useState<ReportCategoryRequest>({
        code: "",
        name: "",
        description: "",
        languageId: 0,
    });

    const {
        languages,
        loading: languagesLoading
    } = useLanguage();

    const {
        addReportCategory,
        saving
    } = useReportCategoryActions({
        onSuccess: () =>
            router.push("/admin/report-category"),
    });

    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        const codeTrim = form.code.trim();

        const nameTrim = form.name.trim();

        const descriptionTrim =
            form.description.trim();

        if (!codeTrim) {
            setError(
                t("form.validation.codeRequired")
            );
            return;
        }

        if (!form.languageId) {
            setError(
                t("form.validation.languageRequired")
            );
            return;
        }

        if (!nameTrim) {
            setError(
                t("form.validation.nameRequired")
            );
            return;
        }

        await addReportCategory({
            code: codeTrim,
            name: nameTrim,
            description: descriptionTrim,
            languageId: form.languageId,
        });
    };

    const handleCancel = () => {
        router.push("/admin/report-category");
    };

    return (
        <div className={layoutStyles.pageContainer}>

            <h1>
                {t("createTitle")}
            </h1>

            <ReportCategoryForm
                value={form}
                onChange={(value) => {

                    setForm(value);

                    if (error) {
                        setError("");
                    }

                }}
                languages={languages}
                onSubmit={handleSubmit}
                isEditing={false}
                onCancel={handleCancel}
                saving={saving || languagesLoading}
                error={error || undefined}
            />

        </div>
    );
}