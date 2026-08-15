"use client";

import ContentStatusForm from "@/features/contentStatus/components/ContentStatusForm";
import { useContentStatusActions } from "@/features/contentStatus/hooks";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateContentStatusPage() {
    const router = useRouter();
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");

    const { addContentStatus, saving } = useContentStatusActions({
        onSuccess: () => router.push("/admin/contentStatus"),
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

        await addContentStatus({ code: codeTrim, name: nameTrim, description: descriptionTrim});

    };

    const handleCancel = () => {
        router.push("/admin/contentStatus");
    };

    const handleStatusChange = (value: string) => {
        setCode(value);
        if (error) setError("");
    };


    return (
            <div className={layoutStyles.pageContainer}>
            <h1>Crear Nuevo Estado</h1>
            
            <ContentStatusForm
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
    );
}
