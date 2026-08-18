"use client";

import Button from "@/shared/components/ui/Button";
import Input from "@/shared/components/ui/Input";
import TextArea from "@/shared/components/ui/TextArea";
import styles from "@/shared/styles/shared/Form.module.css";

interface Props {
    code: string;
    setCode: (value: string) => void;
    name: string;
    setName: (value: string) => void;
    description: string;
    setDescription: (value: string) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    isEditing: boolean;
    onCancel?: () => void;
    saving?: boolean;
    error?: string;
}

export default function SupportTicketStatusForm({
    code,
    setCode,
    name,
    setName,
    description,
    setDescription,
    onSubmit,
    isEditing,
    onCancel,
    saving = false,
    error,
}: Props) {

    return (

        <form onSubmit={onSubmit} className={styles.form}>
            <h2>{isEditing ? 'Editar Estado del ticket' : 'Crear Estado del ticket'}</h2>

            {error && (
                <p className={styles.errorMessage}>
                {error}
                </p>
            )}

            <Input
                label="Código del Estado del ticket"
                value={code}
                onChange={setCode}
                placeholder="Ej: PENDIENTE, RESUELTO, RECHAZADO"
                maxLength={20}
                required
                disabled={saving}
                autoFocus={!isEditing}
            />

            <Input
                label="Nombre del Estado del ticket"
                value={name}
                onChange={setName}
                placeholder="Ej: Pendiente, Resuelto, Rechazado"
                maxLength={50}
                required
                disabled={saving}
                autoFocus={isEditing}
            />

            <TextArea
                label="Descripción del Estado del ticket"
                value={description}
                onChange={setDescription}
                placeholder="Descripción del estado de reporte"
                rows={4}
                disabled={saving}
            />

            <div className={styles.formActions}>

                <Button
                    type="submit"
                    variant="animated"
                    loading={saving}
                    loadingText={isEditing ? 'Actualizando...' : 'Creando...'}
                >
                    {isEditing ? 'Actualizar' : 'Crear'}
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