"use client";

import { useContentCategories } from "@/features/contentCategories/hooks";
import { useContentsActions } from "@/features/contents/hooks/useContentsActions";
import { useContentStatus } from "@/features/contentStatus/hooks";
import { useDiscounts } from "@/features/discounts/hooks";
import { useUploadProgress } from "@/shared/hooks/useUploadProgress";
import { useRouter } from "next/navigation";
import { useState } from "react";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import ProgressBar from "@/shared/components/ui/ProgressBar";
import ContentsForm from "@/features/contents/components/ContentsForm";

export default function CreateMoviePage() {
  const { contentCategories: categories = [] } = useContentCategories();
  const { contentStatus: statuses = [] } = useContentStatus();
  const { discounts = [] } = useDiscounts();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [movieFile, setMovieFile] = useState<File | null>(null);

  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedStatusId, setSelectedStatusId] = useState<number | undefined>();
  const [selectedDiscountId, setSelectedDiscountId] = useState<number | undefined>();

  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [backdropFile, setBackdropFile] = useState<File | null>(null);
  const [trailerFile, setTrailerFile] = useState<File | null>(null);
  const [releaseDate, setReleaseDate] = useState("");
  const [error, setError] = useState("");

  const { progress, handleProgress, resetProgress } = useUploadProgress();

  const { addContent, saving } = useContentsActions({
    onSuccess: () => router.push("/movies"),
  });

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) return setError("El título es obligatorio");
    if (selectedCategories.length === 0) return setError("Selecciona al menos una categoría");
    if (!posterFile) return setError("El poster es obligatorio");
    if (!movieFile) return setError("El archivo de la película es obligatorio");

    setError("");
    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("type", "MOVIE");
    formData.append("price", price.toString());
    formData.append("movie.movieFile", movieFile);

    selectedCategories.forEach((id) => formData.append("categoryIds", id.toString()));
    if (selectedStatusId) formData.append("statusId", selectedStatusId.toString());
    if (selectedDiscountId) formData.append("discountId", selectedDiscountId.toString());

    formData.append("posterFile", posterFile);
    if (trailerFile) formData.append("trailerFile", trailerFile);
    if (backdropFile) formData.append("backdropFile", backdropFile);
    if (releaseDate) formData.append("releaseDate", releaseDate);
    resetProgress();
    await addContent(formData, handleProgress);
  };

  return (
    <div className={layoutStyles.pageContainer}>
      <h1>Crear Película</h1>
      <ProgressBar progress={progress} />

      <ContentsForm
        title={title}
        description={description}
        type="MOVIE"
        lockType
        price={price}
        movieFile={movieFile}
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
        setType={() => {}} 
        setPrice={setPrice}
        setSelectedCategories={setSelectedCategories}
        setSelectedStatusId={setSelectedStatusId}
        setSelectedDiscountId={setSelectedDiscountId}
        setPosterFile={setPosterFile}
        setBackdropFile={setBackdropFile}
        setTrailerFile={setTrailerFile}
        setMovieFile={setMovieFile}
        setReleaseDate={setReleaseDate}
        onSubmit={handleSubmit}
        isEditing={false}
        saving={saving}
        onCancel={() => router.push("/movies")}
      />

      {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
    </div>
  );
}