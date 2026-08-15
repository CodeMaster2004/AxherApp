"use client";

import { useState } from "react";

import ProblemReportForm from "@/features/reports/components/ProblemReportForm";
import { useProblemReportActions } from "@/features/reports/hooks/useProblemReportActions";
import { ProblemReportCategory, ProblemReportRequest } from "@/entities/types/problemReport.types";

import styles from "./ProblemReportModal.module.css";

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

    const [category, setCategory] = useState<
        ProblemReportCategory | ""
    >("");
    const [description, setDescription] = useState("");

    const { saving, error, addProblemReport } =
        useProblemReportActions({
            onSuccess: () => {
                setCategory("");
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
        if (!category) {
            return;
        }
        const data: ProblemReportRequest = {
            category,
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
                    category={category}
                    setCategory={setCategory}
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