"use client";

import { EpisodeDetail } from "@/entities/types";
import { useContentStatus } from "@/features/contentStatus/hooks";
import EpisodesForm from "@/features/episodes/components/EpisodesForm";
import { useEpisodesActions } from "@/features/episodes/hooks/useEpisodesActions";
import { episodesService } from "@/features/episodes/services/EpisodesService";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditEpisodePage() {
  const { contentStatus: statuses = [] } = useContentStatus();
  const router = useRouter();
  const params = useParams();

  const contentId = params?.contentId ? Number(params.contentId) : null;
  const seasonId = params?.seasonId ? Number(params.seasonId) : null;
  const episodeId = params?.episodeId ? Number(params.episodeId) : null;
  const common = useTranslations("common");
  const t = useTranslations("episodes");
  const [episodeNumber, setEpisodeNumber] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [releaseDate, setReleaseDate] = useState("");
  const [selectedStatusId, setSelectedStatusId] = useState<number | undefined>();
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [episodeFile, setEpisodeFile] = useState<File | null>(null);
  const [episodeUrl, setEpisodeUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { saving, editEpisode } = useEpisodesActions(seasonId || 0, {
    onSuccess: () => router.push(`/admin/series/${contentId}/seasons/${seasonId}/episodes`),
  });

  useEffect(() => {
    if (!seasonId || !episodeId) return;

    const load = async () => {
      try {
        const data: EpisodeDetail = await episodesService.getById(seasonId, episodeId);
        setEpisodeNumber(data.episodeNumber);
        setTitle(data.title);
        setDescription(data.description);
        setReleaseDate(data.releaseDate || "");
        if(statuses.length > 0) {
            setSelectedStatusId(
                statuses.find((s) => s.code === data.status.code)?.contentStatusId
            );
        }
        setThumbnailUrl(data.thumbnailUrl || "")
        setEpisodeUrl(data.episodeUrl || "");
      } catch {
        setError(t("errors.load"));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [seasonId, episodeId, statuses]);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) return setError(t("form.validation.titleRequired"));

    setError("");
    const formData = new FormData();
    formData.append("episodeNumber", episodeNumber.toString());
    formData.append("title", title.trim());
    formData.append("description", description || "");
    if (releaseDate) {
        const releaseInstant = new Date(releaseDate).toISOString();
        formData.append("releaseDate", releaseInstant);
    }
    if(selectedStatusId){
        formData.append("statusId", selectedStatusId.toString());
    }
    if (thumbnailFile) formData.append("thumbnailFile", thumbnailFile);
    if (episodeFile) formData.append("episodeFile", episodeFile);

    try {
      await editEpisode(episodeId!, formData);
    } catch {
      setError(t("errors.update"));
    }
  };

  const handleCancel = () => {
    router.push(`/admin/series/${contentId}/seasons/${seasonId}/episodes`);
  };

  if (loading) return <div className={layoutStyles.loading}>{common("loading")}...</div>;

  return (
    <div className={layoutStyles.pageContainer}>
      <h1>{t("editTitle")}</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <EpisodesForm
        episodeNumber={episodeNumber}
        title={title}
        description={description}
        releaseDate={releaseDate}
        availableStatuses={statuses}
        selectedStatusId={selectedStatusId}
        thumbnailFile={thumbnailFile}
        thumbnailUrl={thumbnailUrl}
        episodeFile={episodeFile}
        episodeUrl={episodeUrl}
        setEpisodeNumber={setEpisodeNumber}
        setTitle={setTitle}
        setDescription={setDescription}
        setReleaseDate={setReleaseDate}
        setSelectedStatusId={setSelectedStatusId}
        setThumbnailFile={setThumbnailFile}
        setEpisodeFile={setEpisodeFile}
        onSubmit={handleSubmit}
        isEditing={true}
        saving={saving}
        onCancel={handleCancel}
      />
    </div>
  );
}