"use client";

import { useSupportTicketStatusActions } from "@/features/supportTicketStatus/hooks/useSupportTicketStatusActions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import SupportTicketStatusForm from "@/features/supportTicketStatus/components/SupportTicketStatusForm";
import { useLanguage } from "@/features/language/hooks/useLanguage";
import { SupportTicketStatusRequest } from "@/entities/types";
import { useTranslations } from "next-intl";

export default function CreateSupportTicketStatusPage() {

    const router = useRouter();
    const [error, setError] = useState("");
    const t = useTranslations("supportTicketStatus");

    const { addSupportTicketStatus, saving } = useSupportTicketStatusActions({
        onSuccess: () => router.push("/admin/support/ticket-status"),
    });

    const { languages, loading: languagesLoading } = useLanguage();

    const [form, setForm] = useState<SupportTicketStatusRequest>({
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

        if (!form.languageId) {
            setError(t("form.validation.languageRequired"));
            return;
        }

        if (!nameTrim) {
            setError(t("form.validation.nameRequired"));
            return;
        }

        await addSupportTicketStatus({ 
            code: codeTrim,
            name: nameTrim,
            description: descriptionTrim,
            languageId: form.languageId
        });

    }

    const handleCancel = () => {
        router.push("/admin/support/ticket-status");
    }


    return (
        <div className={layoutStyles.pageContainer}>
            <h1>{t("createTitle")}</h1>
            <SupportTicketStatusForm
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