"use client";

import { ProblemReportCategory } from "@/entities/types/problemReport.types";
import Button from "@/shared/components/ui/Button";
import TextArea from "@/shared/components/ui/TextArea";
import { problemReportCategoryOptions } from "@/shared/constants/selectOptions";
import styles from "@/shared/styles/shared/Form.module.css";

interface Props{
    category: ProblemReportCategory | "";
    setCategory: (
        value: ProblemReportCategory | ""
    ) => void;

    description: string;
    setDescription: (value: string) => void;

    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;

    saving?: boolean;
    error?: string;
    onCancel?: () => void;
}

export default function ProblemReportForm({
    category,
    setCategory,
    description,
    setDescription,
    onSubmit,
    saving = false,
    error,
    onCancel
}: Props) {

    return (

        <form onSubmit={onSubmit} className={styles.form}>
            <h2>Reportar un problema</h2>
            {error && (
                <p className={styles.errorMessage}>
                    {error}
                </p>
            )}

            <div className={styles.field}>
                <label htmlFor="problem-report-category">
                    Categoría
                </label>

                <select
                    id="problem-report-category"
                    className={styles.select}
                    value={category}
                    onChange={(e) =>
                        setCategory(
                            e.target.value as ProblemReportCategory
                        )
                    }
                    disabled={saving}
                    required
                >
                    <option value="">
                        Selecciona una categoría
                    </option>

                    {problemReportCategoryOptions.map(
                        (option) => (
                            <option
                                key={option.value}
                                value={option.value}
                            >
                                {option.label}
                            </option>
                        )
                    )}
                </select>
            </div>

            <TextArea
                label="Descripción del problema"
                value={description}
                onChange={setDescription}
                placeholder="Describe el problema que estás experimentando..."
                rows={6}
                maxLength={1000}
                disabled={saving}
                required
            />
            <div className={styles.formActions}>
                <Button
                    type="submit"
                    variant="animated"
                    loading={saving}
                    loadingText="Enviando..."
                >
                    Enviar reporte
                </Button>
                {onCancel && (
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onCancel}
                        disabled={saving}
                    >
                        Cancelar
                    </Button>
                )}
            </div>
        </form>
    )

}