"use client";

import { useSupportTicketStatusActions } from "@/features/supportTicketStatus/hooks/useSupportTicketStatusActions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import SupportTicketStatusForm from "@/features/supportTicketStatus/components/SupportTicketStatusForm";
import { useLanguage } from "@/features/language/hooks/useLanguage";
import { SupportTicketStatusRequest } from "@/entities/types";

export default function CreateSupportTicketStatusPage() {

    const router = useRouter();
    const [error, setError] = useState("");

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
            setError("Por favor completa el campo de código");
            return;
        }

        if (!form.languageId) {
            setError("Por favor selecciona un idioma");
            return;
        }

        if (!nameTrim) {
            setError("Por favor completa el campo de nombre");
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
            <h1>Crear Nuevo Estado de ticket de soporte</h1>
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