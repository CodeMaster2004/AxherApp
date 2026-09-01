"use client";

import { SupportFaqRequest, SupportFaqResponse } from "@/entities/types/supportFaq.types";

import SupportFaqForm from "@/features/faqs/components/SupportFaqForm";
import { useSupportFaqActions } from "@/features/faqs/hooks/useSupportFaqActions";

import { useSupportCategory } from "@/features/supportCategory/hooks/useSupportCategory";
import { useLanguage } from "@/features/language/hooks/useLanguage";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useTranslations } from "next-intl";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import { adminSupportFaqService } from "@/features/faqs/services/adminSupportFaqService";

export default function EditSupportFaqPage() {

    const router = useRouter();
    const params = useParams();
    const id = params?.id
        ? Number(params.id)
        : null;

    const t = useTranslations("supportFaq");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState<SupportFaqRequest>({
        supportCategoryId: 0,
        languageId: 0,
        question: "",
        answer: "",
        displayOrder: 0,
        active: true,
    });

    const {
        languages,
        loading: languagesLoading,
    } = useLanguage();

    const {
        supportCategory,
        loading: categoriesLoading,
    } = useSupportCategory();

    const {
        editFaq,
        saving,
    } = useSupportFaqActions({
        onSuccess: () =>
            router.push("/admin/faqs"),
    });

    useEffect(() => {

        if (!id) {
            router.push("/admin/faqs");
            return;
        }

        const loadFaq = async () => {

            try {

                const faq: SupportFaqResponse =
                    await adminSupportFaqService.getById(id);

                setForm({
                    supportCategoryId: faq.supportCategoryId,
                    languageId: faq.languageId,
                    question: faq.question,
                    answer: faq.answer,
                    displayOrder: faq.displayOrder,
                    active: faq.active,
                });

            } catch (error) {

                setError(t("errors.load"));
                router.push("/admin/faqs");

            } finally {

                setLoading(false);

            }
        };

        loadFaq();

    }, [id, router, t]);


    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        if (!id) return;

        const questionTrim = form.question.trim();
        const answerTrim = form.answer.trim();

        if (!form.supportCategoryId) {
            setError(t("form.validation.categoryRequired"));
            return;
        }

        if (!form.languageId) {
            setError(t("form.validation.languageRequired"));
            return;
        }

        if (!questionTrim) {
            setError(t("form.validation.questionRequired"));
            return;
        }

        if (!answerTrim) {
            setError(t("form.validation.answerRequired"));
            return;
        }

        await editFaq(id, {
            supportCategoryId: form.supportCategoryId,
            languageId: form.languageId,
            question: questionTrim,
            answer: answerTrim,
            displayOrder: form.displayOrder,
            active: form.active,
        });
    };


    const handleCancel = () => {
        router.push("/admin/faqs");
    };

    if (loading) {

        return (
            <div className={layoutStyles.loading}>
                {t("form.loading")}
            </div>
        );
    }


    return (

        <div className={layoutStyles.pageContainer}>

            <h1>
                {t("editTitle")}
            </h1>

            <SupportFaqForm
                value={form}
                onChange={(value) => {
                    setForm(value);
                    if (error) {
                        setError("");
                    }
                }}
                categories={supportCategory}
                languages={languages}
                onSubmit={handleSubmit}
                isEditing={true}
                onCancel={handleCancel}
                saving={
                    saving ||
                    languagesLoading ||
                    categoriesLoading
                }
                error={error || undefined}
            />

        </div>
    );
}