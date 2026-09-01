"use client";

import { useSupportCategoryActions } from "@/features/supportCategory/hooks/useSupportCategoryActions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import SupportCategoryForm from "@/features/supportCategory/components/SupportCategoryForm";
import { SupportCategoryRequest } from "@/entities/types";
import { useLanguage } from "@/features/language/hooks/useLanguage";
import { useTranslations } from "next-intl";

export default function CreateSupportCategoryPage() {

    const router = useRouter();
    const t = useTranslations("supportCategory");
    const [error, setError] = useState("");

    const [form, setForm] = useState<SupportCategoryRequest>({
        code: "",
        name: "",
        description: "",
        languageId: 0,
    });

    const {languages, loading: languagesLoading} = useLanguage();

    const { addSupportCategory, saving } = useSupportCategoryActions({
        onSuccess: () => router.push("/admin/support/ticket-category"),
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

        await addSupportCategory({ 
            code: codeTrim,
            name: nameTrim,
            description: descriptionTrim,
            languageId: form.languageId
        });

    }

    const handleCancel = () => {
        router.push("/admin/support/ticket-category");
    }


    return (
        <div className={layoutStyles.pageContainer}>
            <h1>{t("create")}</h1>
            <SupportCategoryForm
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