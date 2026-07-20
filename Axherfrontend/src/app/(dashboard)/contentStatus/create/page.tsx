"use client";

import ContentStatusForm from "@/features/contentStatus/components/ContentStatusForm";
import { useContentStatusActions } from "@/features/contentStatus/hooks";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateContentStatusPage() {
    const router = useRouter();
    const [status, setStatus] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");

    const { addContentStatus, saving } = useContentStatusActions({
        onSuccess: () => router.push("/contentStatus"),
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const statusTrim = status.trim();
        const descriptionTrim = description.trim();
        
        if (!statusTrim) {
            setError("Por favor completa el campo de estado");
            return;
        }

        await addContentStatus({ status: statusTrim, description: descriptionTrim});

    };

    const handleCancel = () => {
        router.push("/contentStatus");
    };

    const handleStatusChange = (value: string) => {
        setStatus(value);
        if (error) setError("");
    };


    return (
            <div className={layoutStyles.pageContainer}>
            <h1>Crear Nuevo Estado</h1>
            
            <ContentStatusForm
                contentStatus={status}
                setContentStatus={handleStatusChange}
                description={description}
                setDescription={setDescription}
                onSubmit={handleSubmit}
                isEditing={false}
                onCancel={handleCancel}
                saving={saving}
                error={error}
            />
            </div>
    );
}
