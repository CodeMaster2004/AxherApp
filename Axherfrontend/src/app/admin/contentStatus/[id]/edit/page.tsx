"use client";

import ContentStatusForm from "@/features/contentStatus/components/ContentStatusForm";
import { useContentStatusActions } from "@/features/contentStatus/hooks";
import { useLanguage } from "@/features/language/hooks/useLanguage";
import { contentStatusService } from "@/features/contentStatus/services/ContentStatusService";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ContentStatusRequest, ContentStatusResponse } from "@/entities/types/status.types"
import { useTranslations } from "next-intl";
export default function EditContentStatusPage() {

    const router = useRouter();
    const params = useParams();
    const t = useTranslations("contentStatus");
    const id = params?.id ? Number(params.id) : null;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [form, setForm] = useState<ContentStatusRequest>({
        code: "",
        name: "",
        description: "",
        languageId: 0,
    });

    const { languages, loading: languagesLoading } = useLanguage();

    const { editContentStatus, saving } = useContentStatusActions({
        onSuccess: () => router.push("/admin/contentStatus"),
    });

    useEffect(() => {

        if (!id) {
            router.push("/admin/contentStatus");
            return;
        }

        const loadStatus = async () => {

            try {

                const contentStatus: ContentStatusResponse =
                    await contentStatusService.getById(id);
                    

                setForm({
                    code: contentStatus.code,
                    name: contentStatus.name,
                    description: contentStatus.description ?? "",
                    languageId: contentStatus.languageId,
                });

            } catch (error) {

                console.error("Error cargando estado:", error);

                setError(t("errors.load"));

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

        if (!form.languageId) {
            setError(t("form.validation.languageRequired"));
            return;
        }

        if (!nameTrim) {
            setError(t("form.validation.nameRequired"));
            return;
        }

        await editContentStatus(id, {
            code: codeTrim,
            name: nameTrim,
            description: descriptionTrim,
            languageId: form.languageId,
        });
    };

    const handleCancel = () => {
        router.push("/admin/contentStatus");
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

            <h1>{t("editTitle")}</h1>

            <ContentStatusForm
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