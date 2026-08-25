"use client";

import ReportStatusForm from "@/features/reportStatus/components/ReportStatusForm";
import { useReportStatusActions } from "@/features/reportStatus/hooks/useReportStatusActions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import { useLanguage } from "@/features/language/hooks/useLanguage";
import { ReportStatusRequest } from "@/entities/types";
import { useTranslations } from "next-intl";


export default function CreateReportStatusPage() {

    const router = useRouter();
    const [error, setError] = useState("");
    const t = useTranslations("reportStatus");
    const { addReportStatus, saving } = useReportStatusActions({
        onSuccess: () => router.push("/admin/report-status"),
    });

    const { languages, loading: languagesLoading } = useLanguage();

    const [form, setForm] = useState<ReportStatusRequest>({
        code: "",
        name: "",
        description: "",
        languageId: 0,
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const codeTrim = form.code.trim();
        const nameTrim = form.name.trim();
        const descriptionTrim = form.description.trim();

        if (!codeTrim) {
            setError(t("form.validation.codeRequired"));
            return;
        }

        if(!form.languageId) {
            setError(t("form.validation.languageRequired"));
            return;
        }

        if (!nameTrim) {
            setError(t("form.validation.nameRequired"));
            return;
        }

        await addReportStatus({ 
            code: codeTrim,
            name: nameTrim,
            description: descriptionTrim,
            languageId: form.languageId
        });

    }

    const handleCancel = () => {
        router.push("/admin/report-status");
    }

    return (
        <div className={layoutStyles.pageContainer}>
            <h1>{t("createTitle")}</h1>
            <ReportStatusForm
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
    )
}