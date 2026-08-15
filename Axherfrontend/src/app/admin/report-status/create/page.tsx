"use client";

import ReportStatusForm from "@/features/reportStatus/components/ReportStatusForm";
import { useReportStatusActions } from "@/features/reportStatus/hooks/useReportStatusActions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";


export default function CreateReportStatusPage() {

    const router = useRouter();
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");

    const { addReportStatus, saving } = useReportStatusActions({
        onSuccess: () => router.push("/admin/report-status"),
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

        await addReportStatus({ code: codeTrim, name: nameTrim, description: descriptionTrim });

    }

    const handleCancel = () => {
        router.push("/admin/report-status");
    }

    const handleStatusChange = (value: string) => {
        setCode(value);
        if (error) setError("");
    }

    return (
        <div className={layoutStyles.pageContainer}>
            <h1>Crear Nuevo Estado de Reporte</h1>
            <ReportStatusForm
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