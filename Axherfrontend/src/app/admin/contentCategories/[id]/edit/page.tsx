"use client";

import { ContentCategoryRequest, ContentCategoryResponse } from "@/entities/types";
import ContentCategoriesForm from "@/features/contentCategories/components/ContentCategoriesForm";
import { useContentCategoriesActions } from "@/features/contentCategories/hooks";
import { contentCategoriesService } from "@/features/contentCategories/services/ContentCategoriesService";
import { useLanguage } from "@/features/language/hooks/useLanguage";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditContentCategoryPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id ? Number(params.id) : null;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [form, setForm] =
            useState<ContentCategoryRequest>({
                name: "",
                description: "",
                languageId: 0,
            });
    const t = useTranslations("contentCategories");
    const common = useTranslations("common");

    const {languages, loading: languagesLoading} = useLanguage();
    

    const {editContentCategory, saving} = useContentCategoriesActions({
        onSuccess: () => router.push("/admin/contentCategories"),
    });

    useEffect(() => {
        if (!id) {
            router.push("/admin/contentCategories");
            return;
        }

        const loadCategory = async () => {
            try {
                const category: ContentCategoryResponse =
                    await contentCategoriesService.getById(id);
                    
                setForm({
                    name: category.name,
                    description: category.description ?? "",
                    languageId: category.languageId,
                });
            } catch (error) {
                console.error(
                    "Error loading content category:",
                    error
                );
                alert(t("errors.load"));
                router.push("/admin/contentCategories");
            } finally {
                setLoading(false);
            }
        };

        loadCategory();
    }, [id, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!id) return;

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

        await editContentCategory(id, {
            name: nameTrim,
            description: descriptionTrim,
            languageId: form.languageId,
        });
    };
        
    const handleCancel = () => {
        router.push("/admin/contentCategories");
    };

    if (loading) {
        return <div className={layoutStyles.loading}>{t("loading")}</div>;
    }

    return (
        <div className={layoutStyles.pageContainer}>
        <h1>{common("edit")} {t("title")}</h1>
        
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
            isEditing={true}
            onCancel={handleCancel}
            saving={saving || languagesLoading}
        />

        </div>
    );
}
