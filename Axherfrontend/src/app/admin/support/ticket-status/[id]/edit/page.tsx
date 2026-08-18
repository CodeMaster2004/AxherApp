"use client";

import { SupportTicketStatusResponse } from "@/entities/types";
import { useSupportTicketStatusActions } from "@/features/supportTicketStatus/hooks/useSupportTicketStatusActions";
import { supportTicketStatusService } from "@/features/supportTicketStatus/service/SupportTicketStatusService";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import SupportTicketStatusForm from "@/features/supportTicketStatus/components/SupportTicketStatusForm";

export default function EditSupportTicketStatusPage() {

    const router = useRouter();
    const params = useParams();
    const id = params?.id ? Number(params.id) : null;

    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(true);
    
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
                setCode(supportTicketStatus.code);
                setName(supportTicketStatus.name);
                setDescription(supportTicketStatus.description ?? "");
            } catch (error) {
                console.error("Error cargando estado:", error);
                alert("Error al cargar el estado");
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

        const codeTrim = code.trim();
        const nameTrim = name.trim();
        const descriptionTrim = description.trim();

        if (!codeTrim) {
            alert("Por favor completa el campo de código");
            return;
        }

        if (!nameTrim) {
            alert("Por favor completa el campo de nombre");
            return;
        }

        await editSupportTicketStatus(id, { code: codeTrim, name: nameTrim, description: descriptionTrim });
    };

    const handleCancel = () => {
        router.push("/admin/support/ticket-status");
    };

    if(loading) {
                return <div className={layoutStyles.loading}>Cargando estado...</div>;

    }

    return (
        <div className={layoutStyles.pageContainer}>
            <h1>Editar Estado de Ticket</h1>

            <SupportTicketStatusForm
                code={code}
                setCode={setCode}
                name={name}
                setName={setName}
                description={description}
                setDescription={setDescription}
                onSubmit={handleSubmit}
                isEditing={true}
                onCancel={handleCancel}
                saving={saving}
            />
        </div>
    )
}