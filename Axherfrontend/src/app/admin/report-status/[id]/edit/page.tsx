"use client";

import { ReportStatusRequest, ReportStatusResponse } from "@/entities/types";
import { useReportStatusActions } from "@/features/reportStatus/hooks/useReportStatusActions";
import { reportStatusService } from "@/features/reportStatus/services/ReportStatusService";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import ReportStatusForm from "@/features/reportStatus/components/ReportStatusForm";
import { useLanguage } from "@/features/language/hooks/useLanguage";
import { useTranslations } from "next-intl";


export default function ReportStatusPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id ? Number(params.id) : null;
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const t = useTranslations("reportStatus");

    const [form, setForm] = useState<ReportStatusRequest>({
        code: "",
        name: "",
        description: "",
        languageId: 0,
    });

    const {languages, loading: languagesLoading} = useLanguage();
    
    const { editReportStatus, saving } = useReportStatusActions({
        onSuccess: () => router.push("/admin/report-status"),
    });

    useEffect(() => {
        if (!id) {
            router.push("/admin/report-status");
            return;
        }

        const loadStatus = async () => {
            try {
                const reportStatus: ReportStatusResponse = await reportStatusService.getById(id);
                setForm({
                    code: reportStatus.code,
                    name: reportStatus.name,
                    description: reportStatus.description ?? "",
                    languageId: reportStatus.languageId,
                });
            } catch (error) {
                console.error("Error cargando estado:", error);
                alert(t("error.load"));
                router.push("/admin/report-status");
            } finally {
                setLoading(false);
            }
        };
        loadStatus();
    }, [id, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!id) return;

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

        await editReportStatus(id, {
            code: codeTrim,
            name: nameTrim,
            description: descriptionTrim,
            languageId: form.languageId
        });
    };

    const handleCancel = () => {
        router.push("/admin/report-status");
    };

    if(loading) {
                return <div className={layoutStyles.loading}>{t("loading")}</div>;

    }

    return (
        <div className={layoutStyles.pageContainer}>
            <h1>{t("editTitle")}</h1>

            <ReportStatusForm
                value={form}
                onChange={(value) => { setForm(value); if (error) { setError(""); } }}
                languages={languages}
                onSubmit={handleSubmit}
                isEditing={true}
                onCancel={handleCancel}
                saving={saving || languagesLoading}
                error={error || undefined}
            />
        </div>
    )
}