"use client";

import { EpisodeDetail } from "@/entities/types";
import { useContentStatus } from "@/features/contentStatus/hooks";
import EpisodesList from "@/features/episodes/components/EpisodesList";
import { useEpisodes, useEpisodesActions } from "@/features/episodes/hooks";
import Button from "@/shared/components/ui/Button";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import { useRouter } from "next/navigation";

type Props = {
  contentId: number;
  seasonId: number;
};

export default function EpisodesListView({ contentId, seasonId }: Props) {
  const router = useRouter();

  const {
    episodes,
    loading,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    searchTerm,
    setSearchTerm,
    refetch,
  } = useEpisodes({
    seasonId
  });

  const { deleting, removeEpisode, updateEpisodeStatus } = useEpisodesActions(seasonId || 0, {
    onSuccess: refetch,
  });

  const {contentStatus} = useContentStatus();

  const handleCreate = () => {
    router.push(`/series/${contentId}/seasons/${seasonId}/episodes/create`);
  };

  const handleEdit = (episode: EpisodeDetail) => {
    router.push(`/series/${contentId}/seasons/${seasonId}/episodes/${episode.episodeId}/edit`);
  };

  return (
    <div className={layoutStyles.pageContainer}>
      <Button
        variant="secondary"
        onClick={() => router.push(`/series/${contentId}/seasons`)}
      >
        ← Volver a temporadas
      </Button>

      <div className={layoutStyles.header}>
        <h1>Episodios</h1>
        <Button variant="animated" onClick={handleCreate}>
          Crear Episodio
        </Button>
      </div>



      <EpisodesList
        episodes={episodes}
        statuses={contentStatus}
        onDelete={removeEpisode}
        onEdit={handleEdit}
        onUpdateStatus={(id, statusId) => {
          updateEpisodeStatus(id, {statusId});
        }}
        deletingId={deleting}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onNextPage={nextPage}
        onPrevPage={prevPage}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
    </div>
  );
}