"use client";

import {
    ReportCategoryRequest,
    ReportCategoryResponse,
} from "@/entities/types";
import { useEffect, useState } from "react";

import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/features/language/hooks/useLanguage";
import { reportCategoryService } from "@/features/ReportCategory/services/ReportCategoryService";
import ReportCategoryForm from "@/features/ReportCategory/components/ReportCategoryForm";
import { useReportCategoryActions } from "@/features/ReportCategory/hooks/useReportCategoryActions";
import { useTranslations } from "next-intl";

export default function EditReportCategoryPage() {

    const router = useRouter();
    const t = useTranslations("reportCategory");
    const params = useParams();

    const id = params?.id
        ? Number(params.id)
        : null;

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(true);

    const [form, setForm] =
        useState<ReportCategoryRequest>({
            code: "",
            name: "",
            description: "",
            languageId: 0,
        });

    const {
        languages,
        loading: languagesLoading,
    } = useLanguage();

    const {
        editReportCategory,
        saving,
    } = useReportCategoryActions({
        onSuccess: () =>
            router.push("/admin/report-category"),
    });

    useEffect(() => {

        if (!id) {
            router.push("/admin/report-category");
            return;
        }

        const loadReportCategory = async () => {

            try {

                const reportCategory:
                    ReportCategoryResponse =
                    await reportCategoryService.getById(id);

                setForm({
                    code: reportCategory.code,
                    name: reportCategory.name,
                    description:
                        reportCategory.description ?? "",
                    languageId:
                        reportCategory.languageId,
                });

            } catch (error) {

                console.error(
                    t("errors.load"),
                    error
                );

                setError(
                    t("errors.load")
                );

                router.push("/admin/report-category");

            } finally {

                setLoading(false);

            }
        };

        loadReportCategory();

    }, [id, router, t]);

    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        if (!id) return;

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

        if (!nameTrim) {

            setError(
                t("form.validation.nameRequired")
            );

            return;
        }

        await editReportCategory(id, {
            code: codeTrim,
            name: nameTrim,
            description: descriptionTrim,
            languageId: form.languageId,
        });
    };

    const handleCancel = () => {
        router.push("/admin/report-category");
    };

    if (loading) {

        return (
            <div className={layoutStyles.loading}>
                {t("loading")}
            </div>
        );

    }

    return (

        <div className={layoutStyles.pageContainer}>

            <h1>
                {t("editTitle")}
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
                isEditing={true}
                onCancel={handleCancel}
                saving={saving || languagesLoading}
                error={error || undefined}
            />

        </div>

    );
}