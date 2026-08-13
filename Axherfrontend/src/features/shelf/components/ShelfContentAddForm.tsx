"use client";

import { useState } from "react";
import styles from "@/shared/styles/shared/Form.module.css";
import Input from "@/shared/components/ui/Input";
import Button from "@/shared/components/ui/Button";
import ContentSelector from "@/shared/components/ui/ContentSelector";

interface Props {
    onSubmit: (contentId: number, position: number | null) => void;
    saving?: boolean;
    error?: string;
}

export default function ShelfContentAddForm({
    onSubmit,
    saving = false,
    error
}: Props) {
    const [contentId, setContentId] = useState<number>();
    const [position, setPosition] = useState<number | null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!contentId) return;

        onSubmit(contentId, position);

        // limpiar formulario
        setContentId(undefined);
        setPosition(null);
    };

    return (

        <form onSubmit={handleSubmit} className={styles.form}>

            <h3>Agregar contenido</h3>
            {error && (
                <p className={styles.errorMessage}>
                    {error}
                </p>
            )}

            <ContentSelector
                value={contentId}
                onChange={setContentId}
            />

            <Input
                label="Posición"
                type="number"
                value={position?.toString() ?? ""}
                onChange={(value) => setPosition(Number(value))}
                min={1}
                disabled={saving}
            />

            <div className={styles.formActions}>

                <Button
                    type="submit"
                    variant="animated"
                    loading={saving}
                    loadingText="Agregando..."
                >
                    Agregar contenido
                </Button>

            </div>

        </form>
    )
}