"use client";

import { SupportCategoryResponse } from "@/entities/types";
import SupportCategoryForm from "@/features/supportCategory/components/SupportCategoryForm";
import { useSupportCategoryActions } from "@/features/supportCategory/hooks/useSupportCategoryActions";
import { supportCategoryService } from "@/features/supportCategory/services/SupportCategoryService";
import { useEffect, useState } from "react";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import { useParams, useRouter } from "next/navigation";

export default function EditSupportCategoryPage() {

    const router = useRouter();
    const params = useParams();
    const id = params?.id ? Number(params.id) : null;

    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(true);
    
    const { editSupportCategory, saving } = useSupportCategoryActions({
        onSuccess: () => router.push("/admin/support/ticket-category"),
    });

    useEffect(() => {
        if (!id) {
            router.push("/admin/support/ticket-category");
            return;
        }

        const loadStatus = async () => {
            try {
                const supportCategory: SupportCategoryResponse = await supportCategoryService.getById(id);
                setCode(supportCategory.code);
                setName(supportCategory.name);
                setDescription(supportCategory.description ?? "");
            } catch (error) {
                console.error("Error cargando estado:", error);
                alert("Error al cargar el estado");
                router.push("/admin/support/ticket-category");
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

        await editSupportCategory(id, { code: codeTrim, name: nameTrim, description: descriptionTrim });
    };

    const handleCancel = () => {
        router.push("/admin/support/ticket-category");
    };

    if(loading) {
                return <div className={layoutStyles.loading}>Cargando estado...</div>;

    }

    return (
        <div className={layoutStyles.pageContainer}>
            <h1>Editar Categoría de Ticket</h1>

            <SupportCategoryForm
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