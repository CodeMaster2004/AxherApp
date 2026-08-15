"use client";

import { ReportStatusResponse } from "@/entities/types";
import { useReportStatusActions } from "@/features/reportStatus/hooks/useReportStatusActions";
import { reportStatusService } from "@/features/reportStatus/services/ReportStatusService";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import ReportStatusForm from "@/features/reportStatus/components/ReportStatusForm";


export default function ReportStatusPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id ? Number(params.id) : null;

    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(true);
    
    const { editReportStatus, saving } = useReportStatusActions({
        onSuccess: () => router.push("/admin/report-status"),
    });

    useEffect(() => {
        if (!id) {
            router.push("/admin/report-status");
            return;
        }

        const loadStatus = async () => {
            try {
                const reportStatus: ReportStatusResponse = await reportStatusService.getById(id);
                setCode(reportStatus.code);
                setName(reportStatus.name);
                setDescription(reportStatus.description ?? "");
            } catch (error) {
                console.error("Error cargando estado:", error);
                alert("Error al cargar el estado");
                router.push("/report-status");
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

        await editReportStatus(id, { code: codeTrim, name: nameTrim, description: descriptionTrim });
    };

    const handleCancel = () => {
        router.push("/report-status");
    };

    if(loading) {
                return <div className={layoutStyles.loading}>Cargando estado...</div>;

    }

    return (
        <div className={layoutStyles.pageContainer}>
            <h1>Editar Estado de Reporte</h1>

            <ReportStatusForm
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