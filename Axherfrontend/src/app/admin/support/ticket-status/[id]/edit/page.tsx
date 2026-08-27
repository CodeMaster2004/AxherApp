"use client";

import { SupportTicketStatusRequest, SupportTicketStatusResponse } from "@/entities/types";
import { useSupportTicketStatusActions } from "@/features/supportTicketStatus/hooks/useSupportTicketStatusActions";
import { supportTicketStatusService } from "@/features/supportTicketStatus/service/SupportTicketStatusService";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import SupportTicketStatusForm from "@/features/supportTicketStatus/components/SupportTicketStatusForm";
import { useLanguage } from "@/features/language/hooks/useLanguage";
import { useTranslations } from "next-intl";

export default function EditSupportTicketStatusPage() {

    const router = useRouter();
    const params = useParams();
    const id = params?.id ? Number(params.id) : null;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const t = useTranslations("supportTicketStatus");

    const [form, setForm] = useState<SupportTicketStatusRequest>({
        code: "",
        name: "",
        description: "",
        languageId: 0,
    })

    const {languages, loading: languagesLoading} = useLanguage();
    
    const { editSupportTicketStatus, saving } = useSupportTicketStatusActions({
        onSuccess: () => router.push("/admin/support/ticket-status"),
    });

    useEffect(() => {
        if (!id) {
            router.push("/admin/support/ticket-status");
            return;
        }

        const loadStatus = async () => {
            try {
                const supportTicketStatus: SupportTicketStatusResponse = await supportTicketStatusService.getById(id);
                setForm({
                    code: supportTicketStatus.code,
                    name: supportTicketStatus.name,
                    description: supportTicketStatus.description ?? "",
                    languageId: supportTicketStatus.languageId,
                });
            } catch (error) {
                setError(t("errors.load"));
                router.push("/admin/support/ticket-status");
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

        await editSupportTicketStatus(id, { 
            code: codeTrim,
            name: nameTrim,
            description: descriptionTrim,
            languageId: form.languageId
        });
    };

    const handleCancel = () => {
        router.push("/admin/support/ticket-status");
    };

    if(loading) {
                return <div className={layoutStyles.loading}>{t("loading")}</div>;

    }

    return (
        <div className={layoutStyles.pageContainer}>
            <h1>{t("editTitle")}</h1>

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
                isEditing={true}
                onCancel={handleCancel}
                saving={saving || languagesLoading}
                error={error || undefined}
            />
        </div>
    )
}