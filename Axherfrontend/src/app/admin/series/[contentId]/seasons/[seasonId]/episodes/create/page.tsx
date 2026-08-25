"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import layoutStyles from "@/shared/styles/shared/Layout.module.css"
import EpisodesForm from "@/features/episodes/components/EpisodesForm";
import { useEpisodesActions } from "@/features/episodes/hooks/useEpisodesActions";
import { useContentStatus } from "@/features/contentStatus/hooks";
import { useTranslations } from "next-intl";

export default function CreateEpisodePage() {
  const { contentStatus: statuses = [] } = useContentStatus();
  const router = useRouter();
  const params = useParams();

  const contentId = params?.contentId ? Number(params.contentId) : null;
  const seasonId = params?.seasonId ? Number(params.seasonId) : null;

  const [episodeNumber, setEpisodeNumber] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [releaseDate, setReleaseDate] = useState("");
  const [selectedStatusId, setSelectedStatusId] = useState<number | undefined>();
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [episodeFile, setEpisodeFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const t = useTranslations("episodes");

  const { saving, addEpisode } = useEpisodesActions(seasonId || 0, {
    onSuccess: () => router.push(`/admin/series/${contentId}/seasons/${seasonId}/episodes`),
  });

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) return setError(t("form.validation.titleRequired"));
    if (!thumbnailFile) return setError(t("form.validation.thumbnailRequired"));
    if (!episodeFile) return setError(t("form.validation.episodeFileRequired"));

    setError("");
    const formData = new FormData();
    formData.append("episodeNumber", episodeNumber.toString());
    formData.append("title", title.trim());
    formData.append("description", description || "");
    if (releaseDate) formData.append("releaseDate", releaseDate);
    if (selectedStatusId) {
        formData.append("statusId", selectedStatusId.toString());
    };
    formData.append("thumbnailFile", thumbnailFile);
    formData.append("episodeFile", episodeFile);

    try {
      await addEpisode(formData);
    } catch {
      setError(t("errors.create"));
    }
  };

  const handleCancel = () => {
    router.push(`/admin/series/${contentId}/seasons/${seasonId}/episodes`);
  };

  return (
    <div className={layoutStyles.pageContainer}>
      <h1>{t("createTitle")}</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <EpisodesForm
        episodeNumber={episodeNumber}
        title={title}
        description={description}
        releaseDate={releaseDate}
        availableStatuses={statuses}
        selectedStatusId={selectedStatusId}
        thumbnailFile={thumbnailFile}
        episodeFile={episodeFile}
        setEpisodeNumber={setEpisodeNumber}
        setTitle={setTitle}
        setDescription={setDescription}
        setReleaseDate={setReleaseDate}
        setSelectedStatusId={setSelectedStatusId}
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