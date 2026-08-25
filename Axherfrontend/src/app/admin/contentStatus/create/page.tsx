"use client";

import { ContentStatusRequest } from "@/entities/types/status.types";
import ContentStatusForm from "@/features/contentStatus/components/ContentStatusForm";
import { useContentStatusActions } from "@/features/contentStatus/hooks";
import { useLanguage } from "@/features/language/hooks/useLanguage";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateContentStatusPage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const t = useTranslations("contentStatus");
    const { addContentStatus, saving } = useContentStatusActions({
        onSuccess: () => router.push("/admin/contentStatus"),
    });

    const {
        languages,
        loading: languagesLoading,
    } = useLanguage();

    const [form, setForm] = useState<ContentStatusRequest>({
        code: "",
        name: "",
        description: "",
        languageId: 0,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
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

        await addContentStatus({ code: codeTrim, name: nameTrim, languageId: form.languageId, description: descriptionTrim});

    };

    const handleCancel = () => {
        router.push("/admin/contentStatus");
    };

    return (
            <div className={layoutStyles.pageContainer}>
            <h1>{t("createTitle")}</h1>
            
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
                isEditing={false}
                onCancel={handleCancel}
                saving={saving || languagesLoading}
                error={error || undefined}
            />
            </div>
    );
}
