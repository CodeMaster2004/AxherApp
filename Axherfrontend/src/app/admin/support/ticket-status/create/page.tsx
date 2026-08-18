"use client";

import { useSupportTicketStatusActions } from "@/features/supportTicketStatus/hooks/useSupportTicketStatusActions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import SupportTicketStatusForm from "@/features/supportTicketStatus/components/SupportTicketStatusForm";

export default function CreateSupportTicketStatusPage() {

    const router = useRouter();
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");

    const { addSupportTicketStatus, saving } = useSupportTicketStatusActions({
        onSuccess: () => router.push("/admin/support/ticket-status"),
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const codeTrim = code.trim();
        const nameTrim = name.trim();
        const descriptionTrim = description.trim();

        if (!codeTrim) {
            setError("Por favor completa el campo de código");
            return;
        }

        if (!nameTrim) {
            setError("Por favor completa el campo de nombre");
            return;
        }

        await addSupportTicketStatus({ code: codeTrim, name: nameTrim, description: descriptionTrim });

    }

    const handleCancel = () => {
        router.push("/admin/support/ticket-status");
    }

    const handleStatusChange = (value: string) => {
        setCode(value);
        if (error) setError("");
    }

    return (
        <div className={layoutStyles.pageContainer}>
            <h1>Crear Nuevo Estado de ticket de soporte</h1>
            <SupportTicketStatusForm
                code={code}
                setCode={handleStatusChange}
                name={name}
                setName={setName}
                description={description}
                setDescription={setDescription}
                onSubmit={handleSubmit}
                isEditing={false}
                onCancel={handleCancel}
                saving={saving}
                error={error}
            />
        </div>
    )
}