"use client";

import { ContentCategoryResponse, ContentStatusResponse, Discounts, LanguageResponse } from "@/entities/types";
import Button from "@/shared/components/ui/Button";
import FileInput from "@/shared/components/ui/FileInput";
import FilePreviewOrLink from "@/shared/components/ui/FilePreviewOrLink";
import FormGroup from "@/shared/components/ui/FormGroup";
import Input from "@/shared/components/ui/Input";
import MultiSelect, { MultiSelectOption } from "@/shared/components/ui/MultiSelect";
import Select, { SelectOption } from "@/shared/components/ui/Select";
import TextArea from "@/shared/components/ui/TextArea";
import formStyles from "@/shared/styles/shared/Form.module.css";
import { useTranslations } from "next-intl";

interface Props {
    title: string;
    description?: string;
    price: number;
    type: "MOVIE" | "SERIE" | undefined;

    originalLanguageId?: number;
    availableLanguages: LanguageResponse[];

    // solo para Movie
    movieFile?: File | null;
    movieUrl?: string

    selectedCategories: number[];
    availableCategories: ContentCategoryResponse[];

    selectedStatusId?: number;
    availableStatuses: ContentStatusResponse[];

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
    setOriginalLanguageId: (value: number) => void;

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
    originalLanguageId,
    availableLanguages = [],
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
    setOriginalLanguageId,
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

    const common = useTranslations("common");
    const t = useTranslations("contents");
    const statusOptions: SelectOption[] = availableStatuses.map((status) => ({
        value: status.contentStatusId,
        label: status.name,
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
        {value: "MOVIE", label: t("form.movie")},
        {value: "SERIE", label: t("form.series")},
    ];

    const languageOptions: SelectOption[] = availableLanguages.map((language) => ({
        value: language.languageId,
        label: `${language.name} (${language.nativeName})`,
    }))

    return (
        <form onSubmit={onSubmit} className={formStyles.form}>

            <Select
                label={t("form.contentType")}
                options={typeOptions}
                value={type}
                onChange={(val) => setType(val as "MOVIE" | "SERIE" | undefined)}
                required
                disabled={lockType || isEditing || saving}
            />

            <Input
                label={common("title")}
                value={title}
                onChange={setTitle}
                required
                disabled={saving}
                autoFocus={!isEditing}
            />
            
            <TextArea
                label={common("description")}
                value={description || ""}
                onChange={setDescription}
                rows={4}
                disabled={saving}
            />

            <Select
                label={t("form.originalLanguage")}
                options={languageOptions}
                value={originalLanguageId}
                onChange={(val) => setOriginalLanguageId(Number(val))}
                placeholder={t("form.originalLanguagePlaceholder")}
                required
                disabled={saving || isEditing}
            />

            <Input
                label={t("list.price")}
                type="number"
                value={price.toString()}
                onChange={(val) => setPrice(Number(val))}
                required
                disabled={saving}
                min={0}
                step="0.01"
            />

            <FormGroup label={t("list.categories")}>
                <MultiSelect
                    options={categoryOptions}
                    selected={selectedCategories}
                    onChange={(arr) => setSelectedCategories(arr.map(Number))} 
                    placeholder={t("form.categoryPlaceholder")}
                    multiple={true}
                    disabled={saving}
                />
            </FormGroup>

            <Select
                label={common("status")}
                options={statusOptions}
                value={selectedStatusId}
                onChange={(val) => setSelectedStatusId(val as number | undefined)}
                placeholder={t("form.statusPlaceholder")}
                disabled={saving}
            />

            <Select
                label={t("list.discount")}
                options={discountOptions}
                value={selectedDiscountId}
                onChange={(val) => setSelectedDiscountId(val as number | undefined)}
                placeholder={t("form.discountPlaceholder")}
                disabled={saving}
            />

            <FileInput label={t("form.poster")} accept="image/*" onChange={setPosterFile} disabled={saving}/>
            {!posterFile && <FilePreviewOrLink url={posterUrl} type="image" label={t("form.currentPoster")} file={null}/>}

            <FileInput label={t("form.backdrop")} accept="image/*" onChange={setBackdropFile} disabled={saving}/>
            {!backdropFile && <FilePreviewOrLink url={backdropUrl} type="image" label={t("form.currentBackdrop")} file={null}/>}

            <FileInput label={t("form.trailer")} accept="video/*" onChange={setTrailerFile} disabled={saving}/>
            {!trailerFile && <FilePreviewOrLink url={trailerUrl} type="video" label={t("form.currentTrailer")} file={null}/>}

            {type === "MOVIE" && setMovieFile && (
                <>
                    <FileInput label={t("form.movieFile")} accept="video/*" onChange={setMovieFile} disabled={saving}/>
                    {!movieFile && <FilePreviewOrLink url={movieUrl} type="video" label={t("form.currentMovie")} file={null}/>}
                </>
            )}

            <Input
                label={t("form.releaseDate")}
                type="datetime-local"
                value={releaseDate || ""}
                onChange={setReleaseDate}
                disabled={saving}
            />

            <div className={formStyles.formActions}>
                <Button type="submit" variant="animated" disabled={saving} loadingText={isEditing ? common("updating") : common("creating")}>
                    {isEditing ? common("update") : common("create")}
                </Button>

                {onCancel && (
                    <Button type="button" variant="secondary" onClick={onCancel} disabled={saving}>
                        {common("cancel")}
                    </Button>
                )}

            </div>

        </form>
    )
}