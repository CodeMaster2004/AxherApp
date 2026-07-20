"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import layoutStyles from "@/shared/styles/shared/Layout.module.css"
import EpisodesForm from "@/features/episodes/components/EpisodesForm";
import { useEpisodesActions } from "@/features/episodes/hooks/useEpisodesActions";

export default function CreateEpisodePage() {
  const router = useRouter();
  const params = useParams();

  const contentId = params?.contentId ? Number(params.contentId) : null;
  const seasonId = params?.seasonId ? Number(params.seasonId) : null;

  const [episodeNumber, setEpisodeNumber] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [releaseDate, setReleaseDate] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [episodeFile, setEpisodeFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  const { saving, addEpisode } = useEpisodesActions(seasonId || 0, {
    onSuccess: () => router.push(`/series/${contentId}/seasons/${seasonId}/episodes`),
  });

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) return setError("El título es obligatorio");
    if (!thumbnailFile) return setError("El archivo de miniatura es obligatorio");
    if (!episodeFile) return setError("El archivo del episodio es obligatorio");

    setError("");
    const formData = new FormData();
    formData.append("episodeNumber", episodeNumber.toString());
    formData.append("title", title.trim());
    formData.append("description", description || "");
    if (releaseDate) formData.append("releaseDate", releaseDate);
    formData.append("thumbnailFile", thumbnailFile);
    formData.append("episodeFile", episodeFile);

    try {
      await addEpisode(formData);
    } catch {
      setError("Error al crear el episodio");
    }
  };

  const handleCancel = () => {
    router.push(`/series/${contentId}/seasons/${seasonId}/episodes`);
  };

  return (
    <div className={layoutStyles.pageContainer}>
      <h1>Crear Nuevo Episodio</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <EpisodesForm
        episodeNumber={episodeNumber}
        title={title}
        description={description}
        releaseDate={releaseDate}
        thumbnailFile={thumbnailFile}
        episodeFile={episodeFile}
        setEpisodeNumber={setEpisodeNumber}
        setTitle={setTitle}
        setDescription={setDescription}
        setReleaseDate={setReleaseDate}
        setThumbnailFile={setThumbnailFile}
        setEpisodeFile={setEpisodeFile}
        onSubmit={handleSubmit}
        isEditing={false}
        saving={saving}
        onCancel={handleCancel}
      />
    </div>
  );
}