"use client";

import { ContentDetail } from "@/entities/types";
import { useContentCategories } from "@/features/contentCategories/hooks";
import ContentsForm from "@/features/contents/components/ContentsForm";
import { useContentsActions } from "@/features/contents/hooks/useContentsActions";
import { contentService } from "@/features/contents/services/ContentService";
import { useContentStatus } from "@/features/contentStatus/hooks";
import { useDiscounts } from "@/features/discounts/hooks";
import ProgressBar from "@/shared/components/ui/ProgressBar";
import { useUploadProgress } from "@/shared/hooks/useUploadProgress";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditMoviePage() {
    const { contentCategories: categories = [] } = useContentCategories();
    const { contentStatus: statuses = [] } = useContentStatus();
    const { discounts = [] } = useDiscounts();
    const router = useRouter();
    const params = useParams();
    const id = params?.id ? Number(params.id) : null;

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [type] = useState<"MOVIE">("MOVIE");
    const [price, setPrice] = useState(0);

    const [movieFile, setMovieFile] = useState<File | null>(null);
    const [movieUrl, setMovieUrl] = useState("");

    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [selectedStatusId, setSelectedStatusId] = useState<number | undefined>();
    const [selectedDiscountId, setSelectedDiscountId] = useState<number | undefined>();

    const [posterFile, setPosterFile] = useState<File | null>(null);
    const [backdropFile, setBackdropFile] = useState<File | null>(null);
    const [trailerFile, setTrailerFile] = useState<File | null>(null);

    const [posterUrl, setPosterUrl] = useState("");
    const [backdropUrl, setBackdropUrl] = useState("");
    const [trailerUrl, setTrailerUrl] = useState("");
    const [releaseDate, setReleaseDate] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const { progress, handleProgress, resetProgress } = useUploadProgress();

    const { editContent, saving } = useContentsActions({
        onSuccess: () => router.push("/admin/movies"),
    });

    useEffect(() => {
        if (!id) {
            router.push("/admin/movies");
            return;
        }

        const loadContent = async () => {
            try {
                const content: ContentDetail = await contentService.getById(id);

                if (content.type !== "MOVIE") {
                    router.push("/admin/movies");
                    return;
                }

                setTitle(content.title);
                setDescription(content.description || "");
                setPrice(content.price);

               
                setMovieUrl(content.movieUrl || "");

                if (Array.isArray(content.categories) && categories.length > 0) {
                    const categoryIds = categories
                        .filter((cat) => content.categories.includes(cat.name))
                        .map((cat) => cat.contentCategoryId);
                    setSelectedCategories(categoryIds);
                }

                if (statuses.length > 0) {
                    setSelectedStatusId(
                        statuses.find((s) => s.code === content.status.code)?.contentStatusId
                    );
                }

                if (discounts.length > 0) {
                    setSelectedDiscountId(
                        discounts.find((d) => d.amount === content.discountAmount)?.discountId
                    );
                }

                setPosterUrl(content.posterUrl);
                setBackdropUrl(content.backdropUrl);
                setTrailerUrl(content.trailerUrl);
                if (content.releaseDate) {
                    setReleaseDate(content.releaseDate);
                }
            } catch (err) {
                console.error("Error cargando película:", err);
                router.push("/admin/movies");
            } finally {
                setLoading(false);
            }
        };

        loadContent();
    }, [id, router, categories, statuses, discounts]);

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!id) return;

        if (!title.trim()) {
            setError("El título es obligatorio");
            return;
        }

        if (selectedCategories.length === 0) {
            setError("Selecciona al menos una categoría");
            return;
        }

        setError("");

        const formData = new FormData();

        formData.append("title", title.trim());
        formData.append("description", description.trim());
        formData.append("type", "MOVIE");
        formData.append("price", price.toString());
        if (movieFile) formData.append("movie.movieFile", movieFile);

        selectedCategories.forEach((catId) =>
            formData.append("categoryIds", catId.toString())
        );

        if (selectedStatusId) {
            formData.append("statusId", selectedStatusId.toString());
        }

        if (selectedDiscountId) {
            formData.append("discountId", selectedDiscountId.toString());
        } else {
            formData.append("discountId", "");
        }

        if (posterFile) formData.append("posterFile", posterFile);
        if (backdropFile) formData.append("backdropFile", backdropFile);
        if (trailerFile) formData.append("trailerFile", trailerFile);
        if (releaseDate) {
            formData.append("releaseDate", releaseDate);
        }
        resetProgress();
        await editContent(id, formData, handleProgress);
    };

    if (loading) {
        return <div className={layoutStyles.loading}>Cargando película...</div>;
    }

    return (
        <div className={layoutStyles.pageContainer}>
            <h1>Editar Película</h1>

            <ProgressBar progress={progress} />

            <ContentsForm
                title={title}
                description={description}
                type={type}
                lockType
                price={price}
                movieFile={movieFile}
                movieUrl={movieUrl}
                selectedCategories={selectedCategories}
                availableCategories={categories}
                selectedStatusId={selectedStatusId}
                availableStatuses={statuses}
                selectedDiscountId={selectedDiscountId}
                availableDiscounts={discounts}
                posterFile={posterFile}
                backdropFile={backdropFile}
                trailerFile={trailerFile}
                posterUrl={posterUrl}
                backdropUrl={backdropUrl}
                trailerUrl={trailerUrl}
                setTitle={setTitle}
                setDescription={setDescription}
                setType={() => { } }
                setPrice={setPrice}
                setSelectedCategories={setSelectedCategories}
                setSelectedStatusId={setSelectedStatusId}
                setSelectedDiscountId={setSelectedDiscountId}
                setPosterFile={setPosterFile}
                setBackdropFile={setBackdropFile}
                setTrailerFile={setTrailerFile}
                setMovieFile={setMovieFile}
                onSubmit={handleSubmit}
                isEditing={true}
                saving={saving}
                onCancel={() => router.push("/admin/contents")}
                releaseDate={releaseDate}
                setReleaseDate={setReleaseDate}  
            />

            {error && (
                <p style={{ color: "red", marginTop: 10 }} role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}
