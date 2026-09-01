"use client";

import { SupportFaqRequest } from "@/entities/types/supportFaq.types";
import SupportFaqForm from "@/features/faqs/components/SupportFaqForm";
import { useSupportFaqActions } from "@/features/faqs/hooks/useSupportFaqActions";
import { useLanguage } from "@/features/language/hooks/useLanguage";
import { useSupportCategory } from "@/features/supportCategory/hooks/useSupportCategory";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";

export default function CreateSupportFaqPage() {

    const router = useRouter();
    const t = useTranslations("supportFaq");
    const [error, setError] = useState("");

    const [form, setForm] = useState<SupportFaqRequest>({
        supportCategoryId: 0,
        displayOrder: 0,
        active: true,
        question: "",
        answer: "",
        languageId: 0,
    })

    const {
        languages,
        loading: languagesLoading,
    } = useLanguage();

    const {
        supportCategory,
        loading: categoriesLoading,
    } = useSupportCategory();

    const {
        addFaq,
        saving
    } = useSupportFaqActions({
        onSuccess: () =>
            router.push("/admin/faqs"),
    });

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        const questionTrim = form.question.trim();
        const answerTrim = form.answer.trim();

        if(!form.supportCategoryId) {

            setError(t("form.validation.categoryRequired"));
            return;
        };

        if(!form.languageId) {
            setError(t("form.validation.languageRequired"));
            return;
        };

        if(!questionTrim) {
            setError(t("form.validation.questionRequired"));
            return;
        }

        if(!answerTrim) {
            setError(t("form.validation.answerRequired"));
            return;
        }

        await addFaq({
            supportCategoryId: form.supportCategoryId,
            displayOrder: form.displayOrder,
            active: form.active,
            question: questionTrim,
            answer: answerTrim,
            languageId: form.languageId,
        })

    }
    const handleCancel = () => {
        router.push("/admin/faqs");
    }
    
    return (
        <div className={layoutStyles.pageContainer}>
            <h1>
                {t("createTitle")}
            </h1>

            <SupportFaqForm
                value={form}
                onChange={(value) => {
                    setForm(value);
                    if(error) {
                        setError("");
                    }
                }}
                languages={languages}
                categories={supportCategory}
                onSubmit={handleSubmit}
                isEditing={false}
                onCancel={handleCancel}
                saving={saving || languagesLoading || categoriesLoading}
                error = {error || undefined}
            />
        </div>
    )


}