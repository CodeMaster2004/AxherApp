"use client";

import { useState } from "react";

import ProblemReportForm from "@/features/reports/components/ProblemReportForm";
import { useProblemReportActions } from "@/features/reports/hooks/useProblemReportActions";
import { ProblemReportRequest } from "@/entities/types/problemReport.types";

import styles from "./ProblemReportModal.module.css";
import { useReportCategory } from "@/features/ReportCategory/hooks/useReportCategory";

interface Props {
    isOpen: boolean;
    contentId: number;
    episodeId?: number;
    onClose: () => void;
}

export default function ProblemReportModal({
    isOpen,
    contentId,
    episodeId,
    onClose,
}: Props) {

    const [reportCategoryId, setReportCategoryId] = useState<number | "">("");
    const [description, setDescription] = useState("");

    const {
        reportCategory: categories,
        loading: loadingCategories,
    } = useReportCategory();

    const { saving, error, addProblemReport } =
        useProblemReportActions({
            onSuccess: () => {
                setReportCategoryId("");
                setDescription("");
                onClose();
            },
        });

    if (!isOpen) {
        return null;
    }

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        if (reportCategoryId === "") {
            return;
        }
        const data: ProblemReportRequest = {
            reportCategoryId,
            description,
            contentId,
            ...(episodeId !== undefined && { episodeId }),
        };

        await addProblemReport(data);
    };

    return (
        <div
            className={styles.overlay}
            onClick={onClose}
        >
            <div
                className={styles.modal}
                onClick={(e) => e.stopPropagation()}
            >
                <ProblemReportForm
                    reportCategoryId={reportCategoryId}
                    setReportCategoryId={setReportCategoryId}
                    categories={categories ?? []}
                    description={description}
                    setDescription={setDescription}
                    onSubmit={handleSubmit}
                    saving={saving}
                    error={
                        error instanceof Error
                            ? error.message
                            : undefined
                    }
                    onCancel={onClose}
                />
            </div>
        </div>
    );
}