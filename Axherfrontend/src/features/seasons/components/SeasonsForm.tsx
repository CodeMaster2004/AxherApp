"use client";

import Button from "@/shared/components/ui/Button";
import Input from "@/shared/components/ui/Input";
import TextArea from "@/shared/components/ui/TextArea";
import formStyles from "@/shared/styles/shared/Form.module.css";

interface Props {
    seasonNumber: number;
    title: string;
    description?: string;
    releaseDate?: string;

    setSeasonNumber: (value: number) => void;
    setTitle: (value: string) => void;
    setDescription: (value: string) => void;
    setReleaseDate: (value: string) => void;

    onSubmit: React.FormEventHandler<HTMLFormElement>;
    isEditing?: boolean;
    saving?: boolean;
    onCancel?: () => void;
}

export default function SeasonsForm({
    seasonNumber,
    title,
    description,
    releaseDate,
    setSeasonNumber,
    setTitle,
    setDescription,
    setReleaseDate,
    onSubmit,
    isEditing,
    saving = false,
    onCancel,
}: Props) {
    return (
        <form onSubmit={onSubmit} className={formStyles.form}>
            <h2>{isEditing ? "Editar Temporada" : "Crear Temporada"}</h2>

            <Input
                label="Número de Temporada"
                type="number"
                value={seasonNumber.toString()}
                onChange={(val) => setSeasonNumber(Number(val))}
                required
                min={1}
                disabled={saving}
                autoFocus={!isEditing}
            />
            
            <Input
                label="Título"
                value={title}
                onChange={setTitle}
                required
                disabled={saving}
            />
            
            <TextArea
                label="Descripción"
                value={description || ""}
                onChange={setDescription}
                rows={4}
                disabled={saving}
            />

            <Input
                label="Fecha de Estreno"
                type="date"
                value={releaseDate || ""}
                onChange={setReleaseDate}
                disabled={saving}
            />

            <div className={formStyles.formActions}>
                <Button
                    type="submit"
                    variant="animated"
                    disabled={saving}
                    loadingText={isEditing ? "Actualizando..." : "Creando..."}
                    >
                    {isEditing ? "Actualizar" : "Crear"}
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