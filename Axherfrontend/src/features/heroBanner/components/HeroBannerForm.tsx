"use client";
import Button from "@/shared/components/ui/Button";
import ContentSelector from "@/shared/components/ui/ContentSelector";
import FileInput from "@/shared/components/ui/FileInput";
import FilePreviewOrLink from "@/shared/components/ui/FilePreviewOrLink";
import Input from "@/shared/components/ui/Input";
import TextArea from "@/shared/components/ui/TextArea";
import styles from "@/shared/styles/shared/Form.module.css";

interface Props {
    contentId?: number;
    titleOverride: string;
    descriptionOverride: string;
    backdropFile: File | null;
    backdropUrl?: string;
    startDate: string;
    endDate: string;
    priority: number;
    active: boolean;


    setContentId:(value:number)=>void;
    setTitleOverride:(value:string)=>void;
    setDescriptionOverride:(value:string)=>void;
    setBackdropFile:(file: File | null) => void;
    setBackdropUrl?:(value:string)=>void;
    setStartDate:(value:string)=>void;
    setEndDate:(value:string)=>void;
    setPriority:(value:number)=>void;
    setActive:(value:boolean)=>void;


    onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
    isEditing?:boolean;
    saving?:boolean;
    onCancel?:()=>void;

}

export default function HeroBannerForm({

    contentId,
    titleOverride,
    descriptionOverride,
    backdropUrl,
    backdropFile,
    startDate,
    endDate,
    priority,
    active,

    setContentId,
    setTitleOverride,
    setDescriptionOverride,
    setBackdropUrl,
    setBackdropFile,
    setStartDate,
    setEndDate,
    setPriority,
    setActive,

    onSubmit,
    isEditing,
    saving = false,
    onCancel

}: Props){

    return (
        <form className={styles.form} onSubmit={onSubmit}>

            <h2>
                {
                    isEditing
                    ? "Editar Hero Banner"
                    : "Crear Hero Banner"
                }
            </h2>

            <ContentSelector
                value={contentId}
                onChange={setContentId}
            />

            <Input
                label="Título (opcional)"
                value={titleOverride}
                onChange={setTitleOverride}
                placeholder="Dejar vacio para usar titulo original"
                disabled={saving}
            />

            <TextArea
                label="Descripción (opcional)"
                value={descriptionOverride}
                onChange={setDescriptionOverride}
                placeholder="Dejar vacio para usar descripción original"
                rows={4}
                disabled={saving}
            />

            <Input
                label="Prioridad"
                type="number"
                value={priority.toString()}
                onChange={(value)=>setPriority(Number(value))}
                min={0}
                disabled={saving}
            />

            <FileInput
                label="Imagen de fondo"
                accept="image/*"
                onChange={setBackdropFile}
                disabled={saving}
            />

            {
                !backdropFile && backdropUrl && (
                    <FilePreviewOrLink
                        url={backdropUrl}
                        type="image"
                        label="Imagen de fondo actual"
                        file={null}
                    />
                )
            }

            <Input
                label="Fecha inicio"
                type="datetime-local"
                value={startDate || ""}
                onChange={setStartDate}
                disabled={saving}
            />

            <Input
                label="Fecha fin"
                type="datetime-local"
                value={endDate || ""}
                onChange={setEndDate}
                disabled={saving}
            />

            <label>
                <input
                    type="checkbox"
                    checked={active}
                    onChange={(e)=>setActive(e.target.checked)}
                    disabled={saving}
                />
                Activo
            </label>
                
            <div className={styles.formActions}>

                <Button
                    type="submit"
                    variant="animated"
                    loading={saving}
                    loadingText={
                        isEditing
                        ? "Actualizando..."
                        : "Creando..."
                    }
                >
                    {
                        isEditing
                        ? "Actualizar"
                        : "Crear"
                    }
                </Button>

                {
                    onCancel && (
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onCancel}
                            disabled={saving}
                        >
                            Cancelar
                        </Button>
                    )
                }
            </div>

        </form>
    )
}