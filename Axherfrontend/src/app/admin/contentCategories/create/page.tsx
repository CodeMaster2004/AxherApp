"use client";

import { useRouter } from "next/navigation";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import ContentCategoriesForm from "@/features/contentCategories/components/ContentCategoriesForm";
import { useContentCategoriesActions } from "@/features/contentCategories/hooks";
import { useLanguage } from "@/features/language/hooks/useLanguage";
import { useState } from "react";
import { ContentCategoryRequest } from "@/entities/types";
import { useTranslations } from "next-intl";

export default function CreateContentCategoryPage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const common = useTranslations("common");
    const t = useTranslations("contentCategories");
    const { addContentCategory, saving } = useContentCategoriesActions({
        onSuccess: () => router.push("/admin/contentCategories"),
    });
    
    const {languages, loading: languagesLoading} = useLanguage();
    const [form, setForm] =
        useState<ContentCategoryRequest>({
            name: "",
            description: "",
            languageId: 0,
        });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const nameTrim = form.name.trim();
        const descriptionTrim = form.description.trim();
        
        if (!nameTrim) {
            setError(
                t("form.validation.nameRequired")
            );
            return;
        }
        if (!form.languageId) {
            setError(
                t("form.validation.languageRequired")
            );
            return;
        }

        if (!descriptionTrim) {
            setError(
                t("form.validation.descriptionRequired")
            );
            return;
        }

        await addContentCategory({
            name: nameTrim,
            description: descriptionTrim,
            languageId: form.languageId,
        });
    };

    const handleCancel = () => {
        router.push("/admin/contentCategories");
    };

    return (
        <div className={layoutStyles.pageContainer}>
        <h1>{common("create")} {t("title")}</h1>
        
        <ContentCategoriesForm
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
        />
        </div>
    );
}
