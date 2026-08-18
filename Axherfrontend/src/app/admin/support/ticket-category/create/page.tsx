"use client";

import { useSupportCategoryActions } from "@/features/supportCategory/hooks/useSupportCategoryActions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import SupportCategoryForm from "@/features/supportCategory/components/SupportCategoryForm";

export default function CreateSupportCategoryPage() {

    const router = useRouter();
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");

    const { addSupportCategory, saving } = useSupportCategoryActions({
        onSuccess: () => router.push("/admin/support/ticket-category"),
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

        await addSupportCategory({ code: codeTrim, name: nameTrim, description: descriptionTrim });

    }

    const handleCancel = () => {
        router.push("/admin/support/ticket-category");
    }

    const handleStatusChange = (value: string) => {
        setCode(value);
        if (error) setError("");
    }

    return (
        <div className={layoutStyles.pageContainer}>
            <h1>Crear Nueva Categoría de Soporte</h1>
            <SupportCategoryForm
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