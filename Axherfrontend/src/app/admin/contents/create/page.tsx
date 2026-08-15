"use client";

import { useContentCategories } from "@/features/contentCategories/hooks";
import { useContentsActions } from "@/features/contents/hooks/useContentsActions";
import { useContentStatus } from "@/features/contentStatus/hooks";
import { useDiscounts } from "@/features/discounts/hooks";
import { useUploadProgress } from "@/shared/hooks/useUploadProgress";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import layoutStyles from "@/shared/styles/shared/Layout.module.css"
import ProgressBar from "@/shared/components/ui/ProgressBar";
import ContentsForm from "@/features/contents/components/ContentsForm";

export default function CreateContentPage() {
    const { contentCategories: categories = [] } = useContentCategories();
    const { contentStatus: statuses = [] } = useContentStatus();
    const { discounts = [] } = useDiscounts();
    const router = useRouter();
    const searchParams = useSearchParams();
    const isSeriesContext = searchParams.get("type") === "SERIE";
    const initialType: "MOVIE" | "SERIE" | undefined = isSeriesContext ? "SERIE" : undefined;

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState<"MOVIE" | "SERIE" | undefined>(initialType);
    const [price, setPrice] = useState(0);

    const [movieFile, setMovieFile] = useState<File | null>(null);

    const [selectedCategories, SetSelectedCategories] = useState<number[]>([]);
    const [selectedStatusId, setSelectedStatusId] = useState<number | undefined>();
    const [selectedDiscountId, setSelectedDiscountId] = useState<number | undefined>();

    const [posterFile, setPosterFile] = useState<File | null>(null);
    const [backdropFile, setBackdropFile] = useState<File | null>(null);
    const [trailerFile, setTrailerFile] = useState<File | null>(null);
    const [releaseDate, setReleaseDate] = useState("");

    const [error, setError] = useState("");

    const{ progress, handleProgress, resetProgress } = useUploadProgress();

    const { addContent, saving } = useContentsActions({
        onSuccess: () => router.push("/admin/series"),
    });

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!title.trim()) {
            setError("El titulo es obligatorio");
            return;
        }

        if (selectedCategories.length === 0) {
            setError("Selecciona al menos una categoría");
            return;
        }

        if (!posterFile) {
            setError("El poster es obligatorio");
            return;
        }
        if (!backdropFile){
            setError("El backdrop es obligatorio");
            return;
        }

        if (!type) {
            setError("Selecciona el tipo de contenido");
            return;
        }

        // Validacion especifica para movies
        if (type === "MOVIE" && !movieFile) {
            setError("El archivo de la película es obligatorio para tipo MOVIE");
            return;;
        }

        setError("");

        const formData = new FormData();

        formData.append("title", title.trim());
        formData.append("description", description.trim());
        formData.append("type", type);
        formData.append("price", price.toString());

        //Solo para movies
        if(type === "MOVIE") {
            if(movieFile) formData.append("movie.movieFile", movieFile);
        }

        // Para series
        if(type === "SERIE") {
            formData.append("series.placeholder", "true");
        }

        selectedCategories.forEach((id) =>
            formData.append("categoryIds", id.toString())
        );

        if (selectedStatusId) {
            formData.append("statusId", selectedStatusId.toString());
        };

        if(selectedDiscountId) {
            formData.append("discountId", selectedDiscountId.toString());
        }

        formData.append("posterFile", posterFile);
        formData.append("backdropFile", backdropFile);
        if(trailerFile) formData.append("trailerFile", trailerFile);
        if (releaseDate) formData.append("releaseDate", releaseDate);
        resetProgress();
        await addContent(formData, handleProgress);
    };

    return (
        <div className={layoutStyles.pageContainer}>
            <h1>Crear Contenido</h1>
            <ProgressBar progress={progress}/>
            <ContentsForm
                title={title}
                description={description}
                type={type}
                lockType={isSeriesContext}
                price={price}
                movieFile={type === "MOVIE" ? movieFile : undefined}
                selectedCategories={selectedCategories}
                availableCategories={categories}
                selectedStatusId={selectedStatusId}
                availableStatuses={statuses}
                selectedDiscountId={selectedDiscountId}
                availableDiscounts={discounts}
                posterFile={posterFile}
                backdropFile={backdropFile}
                trailerFile={trailerFile}
                releaseDate={releaseDate}
                setTitle={setTitle}
                setDescription={setDescription}
                setType={setType}
                setPrice={setPrice}
                setSelectedCategories={SetSelectedCategories}
                setSelectedStatusId={setSelectedStatusId}
                setSelectedDiscountId={setSelectedDiscountId}
                setPosterFile={setPosterFile}
                setBackdropFile={setBackdropFile}
                setTrailerFile={setTrailerFile}
                setMovieFile={type === "MOVIE" ? setMovieFile : undefined}
                setReleaseDate={setReleaseDate}
                onSubmit={handleSubmit}
                isEditing={false}
                saving={saving}
                onCancel={() => router.push("/admin/contents")}

            />
            {error && (
                <p style={{ color: "red", marginTop: 10}} role="alert">
                    {error}
                </p>
            )}

        </div>
    )

}