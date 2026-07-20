"use client";

import { ContentCategories, ContentStatus, Discounts } from "@/entities/types";
import Button from "@/shared/components/ui/Button";
import FileInput from "@/shared/components/ui/FileInput";
import FilePreviewOrLink from "@/shared/components/ui/FilePreviewOrLink";
import FormGroup from "@/shared/components/ui/FormGroup";
import Input from "@/shared/components/ui/Input";
import MultiSelect, { MultiSelectOption } from "@/shared/components/ui/MultiSelect";
import Select, { SelectOption } from "@/shared/components/ui/Select";
import TextArea from "@/shared/components/ui/TextArea";
import formStyles from "@/shared/styles/shared/Form.module.css";

interface Props {
    title: string;
    description?: string;
    price: number;
    type: "MOVIE" | "SERIE" | undefined;

    // solo para Movie
    movieFile?: File | null;
    movieUrl?: string

    selectedCategories: number[];
    availableCategories: ContentCategories[];

    selectedStatusId?: number;
    availableStatuses: ContentStatus[];

    selectedDiscountId?: number;
    availableDiscounts: Discounts[];

    posterFile: File | null;
    backdropFile : File | null;
    trailerFile: File | null;

    posterUrl?: string;
    backdropUrl?: string;
    trailerUrl?: string;

    releaseDate: string; // formato "YYYY-MM-DD"

    setTitle: (value: string) => void;
    setDescription: (value: string) => void;
    setPrice: (value: number) => void;
    setType: (value: "MOVIE" | "SERIE" | undefined) => void;

    setSelectedCategories: (value: number[]) => void;
    setSelectedStatusId: (value?: number) => void;
    setSelectedDiscountId: (value?: number) => void;
    
    setPosterFile: (file: File | null) => void;
    setBackdropFile: (file: File | null) => void;
    setTrailerFile: (file: File | null) => void;
    setMovieFile?: (file: File | null) => void;

    setReleaseDate: (value: string) => void;

    onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
    isEditing?: boolean;
    lockType?: boolean;
    saving?: boolean;
    onCancel?: () => void;
}

export default function ContentsForm({
    title,
    description,
    price,
    type,
    movieFile,
    movieUrl,
    selectedCategories = [],
    availableCategories,
    selectedStatusId,
    availableStatuses = [],
    selectedDiscountId,
    availableDiscounts = [],
    posterFile,
    backdropFile,
    trailerFile,
    posterUrl,
    backdropUrl,
    trailerUrl,
    releaseDate,
    setTitle,
    setDescription,
    setPrice,
    setType,
    setSelectedCategories,
    setSelectedStatusId,
    setSelectedDiscountId,
    setPosterFile,
    setBackdropFile,
    setTrailerFile,
    setMovieFile,
    setReleaseDate,
    onSubmit,
    isEditing,
    lockType = false,
    saving = false,
    onCancel,
}: Props) {
    const statusOptions: SelectOption[] = availableStatuses.map((status) => ({
        value: status.contentStatusId,
        label: status.status,
    }));

    const discountOptions: SelectOption[] = availableDiscounts.map((discount) => ({
        value: discount.discountId,
        label: `${discount.discountType} (${discount.description}%)`,
    }));

    const categoryOptions: MultiSelectOption[] = availableCategories.map((cat) => ({
        value: cat.contentCategoryId,
        label: cat.name,
    }));

    const typeOptions: SelectOption[] = [
        {value: "MOVIE", label: "Película"},
        {value: "SERIE", label: "Serie"},
    ];

    return (
        <form onSubmit={onSubmit} className={formStyles.form}>
            <h2>{isEditing ? "Editar Contenido" : "Crear Contenido"}</h2>

            <Select
                label="Tipo de contenido"
                options={typeOptions}
                value={type}
                onChange={(val) => setType(val as "MOVIE" | "SERIE" | undefined)}
                required
                disabled={lockType || isEditing || saving}
            />

            <Input
                label="Título"
                value={title}
                onChange={setTitle}
                required
                disabled={saving}
                autoFocus={!isEditing}
            />
            
            <TextArea
                label="Descripción"
                value={description || ""}
                onChange={setDescription}
                rows={4}
                disabled={saving}
            />

            <Input
                label="Precio"
                type="number"
                value={price.toString()}
                onChange={(val) => setPrice(Number(val))}
                required
                disabled={saving}
                min={0}
                step="0.01"
            />

            <FormGroup label="Categorías">
                <MultiSelect
                    options={categoryOptions}
                    selected={selectedCategories}
                    onChange={(arr) => setSelectedCategories(arr.map(Number))} 
                    placeholder="Agregar categoria"
                    multiple={true}
                    disabled={saving}
                />
            </FormGroup>

            <Select
                label="Estado"
                options={statusOptions}
                value={selectedStatusId}
                onChange={(val) => setSelectedStatusId(val as number | undefined)}
                placeholder="Seleccionar estado"
                disabled={saving}
            />

            <Select
                label="Descuento"
                options={discountOptions}
                value={selectedDiscountId}
                onChange={(val) => setSelectedDiscountId(val as number | undefined)}
                placeholder="Sin descuento"
                disabled={saving}
            />

            <FileInput label="Poster" accept="image/*" onChange={setPosterFile} disabled={saving}/>
            {!posterFile && <FilePreviewOrLink url={posterUrl} type="image" label="Poster actual" file={null}/>}

            <FileInput label="Backdrop" accept="image/*" onChange={setBackdropFile} disabled={saving}/>
            {!backdropFile && <FilePreviewOrLink url={backdropUrl} type="image" label="Backdrop actual" file={null}/>}

            <FileInput label="Trailer" accept="video/*" onChange={setTrailerFile} disabled={saving}/>
            {!trailerFile && <FilePreviewOrLink url={trailerUrl} type="video" label="Trailer actual" file={null}/>}

            {type === "MOVIE" && setMovieFile && (
                <>
                    <FileInput label="Pelicula" accept="video/*" onChange={setMovieFile} disabled={saving}/>
                    {!movieFile && <FilePreviewOrLink url={movieUrl} type="video" label="Pelicula actual" file={null}/>}
                </>
            )}

            <Input
                label="Fecha de estreno"
                type="date"
                value={releaseDate || ""}
                onChange={setReleaseDate}
                disabled={saving}
            />

            <div className={formStyles.formActions}>
                <Button type="submit" variant="animated" disabled={saving} loadingText={isEditing ? "Actualizando..." : "Creando..."}>
                    {isEditing ? "Actualizar" : "Crear"}
                </Button>

                {onCancel && (
                    <Button type="button" variant="secondary" onClick={onCancel} disabled={saving}>
                        Cancelar
                    </Button>
                )}

            </div>

        </form>
    )
}