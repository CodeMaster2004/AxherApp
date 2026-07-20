"use client";
import Button from "@/shared/components/ui/Button";
import FileInput from "@/shared/components/ui/FileInput";
import FilePreviewOrLink from "@/shared/components/ui/FilePreviewOrLink";
import formStyles from "@/shared/styles/shared/Form.module.css";
import Input from "@/shared/components/ui/Input";
import TextArea from "@/shared/components/ui/TextArea";

interface Props {
    episodeNumber: number;
    title: string;
    description?: string;
    releaseDate?: string;

    thumbnailFile?: File | null;
    episodeFile: File | null;
    thumbnailUrl?: string;
    episodeUrl?: string;

    setEpisodeNumber: (value: number) => void;
    setTitle: (value: string) => void;
    setDescription: (value?: string) => void;
    setReleaseDate: (value: string) => void;
    setThumbnailFile: (file: File | null) => void;
    setEpisodeFile: (file: File | null) => void;

    onSubmit: React.FormEventHandler<HTMLFormElement>;
    isEditing: boolean;
    saving?: boolean;
    onCancel?: () => void;
}

export default function EpisodesForm({
    episodeNumber,
    title,
    description,
    releaseDate,
    episodeFile,
    episodeUrl,
    thumbnailFile,
    thumbnailUrl,
    setEpisodeNumber,
    setTitle,
    setDescription,
    setReleaseDate,
    setEpisodeFile,
    setThumbnailFile,
    onSubmit,
    isEditing,
    saving = false,
    onCancel,
}: Props) {
    return (
        <form onSubmit={onSubmit} className={formStyles.form}>
            <h2>{isEditing ? "Editar Episodio" : "Crear Episodio"}</h2>

            <Input
                label="Número de episodio"
                type="number"
                value={episodeNumber.toString()}
                onChange={(val) => setEpisodeNumber(Number(val))}
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
                label="Fecha de estreno"
                type="date"
                value={releaseDate || ""}
                onChange={setReleaseDate}
                disabled={saving}
            />

            <FileInput
                label="Archivo de miniatura"
                accept="image/*"
                onChange={setThumbnailFile}
                disabled={saving}
            />
            {!thumbnailFile && (
                <FilePreviewOrLink url={thumbnailUrl} type="image" label="Miniatura actual" file={null} />
            )}
            <FileInput
                label="Archivo de episodio"
                accept="video/*"
                onChange={setEpisodeFile}
                disabled={saving}
            />
            {!episodeFile && (
                <FilePreviewOrLink url={episodeUrl} type="video" label="Episodio actual" file={null} />
            )}

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
    );
}