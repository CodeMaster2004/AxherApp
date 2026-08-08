"use client";

import { ContentStatus } from "@/entities/types";
import ContentStatusForm from "@/features/contentStatus/components/ContentStatusForm";
import { useContentStatusActions } from "@/features/contentStatus/hooks";
import { contentStatusService } from "@/features/contentStatus/services/ContentStatusService";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditContentStatusPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id ? Number(params.id) : null;
    
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(true);

    const { editContentStatus, saving } = useContentStatusActions({
        onSuccess: () => router.push("/contentStatus"),
    });

    useEffect(() => {
        if (!id) {
            router.push("/contentStatus");
            return;
        }

        const loadStatus = async () => {
            try {
                const contentStatus: ContentStatus = await contentStatusService.getById(id);
                setCode(contentStatus.code);
                setName(contentStatus.name);
                setDescription(contentStatus.description);
            } catch (error) {
                console.error("Error cargando estado:", error);
                alert("Error al cargar el estado");
                router.push("/contentStatus");
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

        await editContentStatus(id, { code: codeTrim, name: nameTrim, description: descriptionTrim});

    };

    const handleCancel = () => {
        router.push("/contentStatus");
    };

    if (loading) {
        return <div className={layoutStyles.loading}>Cargando estado...</div>;
    }

    return (
        //<ProtectedRoute allowedRoles={["ADMIN"]}>
            <div className={layoutStyles.pageContainer}>
            <h1>Editar Estado</h1>
            
            <ContentStatusForm
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
        //</ProtectedRoute>
    );
}
