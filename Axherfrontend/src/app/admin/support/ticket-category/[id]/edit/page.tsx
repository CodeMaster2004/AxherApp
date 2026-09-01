"use client";

import { SupportCategoryRequest, SupportCategoryResponse } from "@/entities/types";
import SupportCategoryForm from "@/features/supportCategory/components/SupportCategoryForm";
import { useSupportCategoryActions } from "@/features/supportCategory/hooks/useSupportCategoryActions";
import { supportCategoryService } from "@/features/supportCategory/services/SupportCategoryService";
import { useEffect, useState } from "react";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/features/language/hooks/useLanguage";
import { useTranslations } from "next-intl";

export default function EditSupportCategoryPage() {

    const router = useRouter();
    const t = useTranslations("supportCategory");
    const params = useParams();
    const id = params?.id ? Number(params.id) : null;
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState<SupportCategoryRequest>({
        code: "",
        name: "",
        description: "",
        languageId: 0,
    });

    const {
        languages,
        loading: languagesLoading,
    } = useLanguage();
    
    const { editSupportCategory, saving } = useSupportCategoryActions({
        onSuccess: () => router.push("/admin/support/ticket-category"),
    });

    useEffect(() => {
        if (!id) {
            router.push("/admin/support/ticket-category");
            return;
        }

        const loadStatus = async () => {
            try {
                const supportCategory: SupportCategoryResponse = await supportCategoryService.getById(id);
                setForm({
                    code: supportCategory.code,
                    name: supportCategory.name,
                    description: supportCategory.description ?? "",
                    languageId: supportCategory.languageId,
                });
            } catch (error) {
                setError(t("errors.load"));
                router.push("/admin/support/ticket-category");
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
            alert(t("form.validation.codeRequired"));
            return;
        }

        if (!form.languageId) {
            setError(
                t("form.validation.languageRequired")
            );
            return;
        }

        if (!nameTrim) {
            setError(t("form.validation.nameRequired"));
            return;
        }

        await editSupportCategory(id, {
            code: codeTrim,
            name: nameTrim,
            description: descriptionTrim,
            languageId: form.languageId
        });
    };

    const handleCancel = () => {
        router.push("/admin/support/ticket-category");
    };

    if(loading) {
                return <div className={layoutStyles.loading}>Cargando estado...</div>;

    }

    return (
        <div className={layoutStyles.pageContainer}>
            <h1>{t("edit")}</h1>

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
                isEditing={true}
                onCancel={handleCancel}
                saving={saving || languagesLoading}
                error={error || undefined}
            />
        </div>
    )

}