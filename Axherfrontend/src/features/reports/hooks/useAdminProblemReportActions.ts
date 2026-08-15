"use client";

import { ProblemReportResponse, ProblemReportStatusRequest } from "@/entities/types/problemReport.types";
import { adminProblemReportService } from "@/features/reports/services/AdminProblemReportService";
import { useState } from "react";

interface Options {
    onSuccess?: (report: ProblemReportResponse) => void;
}

export const useAdminProblemReportActions = (
    options?: Options
) => {

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateStatus = async (
        reportId: number,
        data: ProblemReportStatusRequest
    ) => {
        try {
            setSaving(true);
            setError(null);

            const response = await adminProblemReportService.updateStatus(
                reportId,
                data
            );

            options?.onSuccess?.(response);
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : "No se pudo actualizar el estado del reporte.";

            setError(message);
        } finally {
            setSaving(false);
        }
    };

    return {
        saving,
        error,
        updateStatus,
    };
}