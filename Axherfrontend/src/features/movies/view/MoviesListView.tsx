"use client";

import { ContentDetail, ContentType } from "@/entities/types";
import ContentsList from "@/features/contents/components/ContentsList";
import { useContents } from "@/features/contents/hooks/useContents";
import { useContentsActions } from "@/features/contents/hooks/useContentsActions";
import { useContentStatus } from "@/features/contentStatus/hooks";
import Button from "@/shared/components/ui/Button";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import { useRouter } from "next/navigation";


export default function MoviesListView() {
  const router = useRouter();

  const {
    contents: movies,
    loading,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    searchTerm,
    setSearchTerm,
    refetch,
  } = useContents({
    initialFilters: { type: ContentType.MOVIE },
  });

  const { deleting, removeContent, updateContentStatus } = useContentsActions({
    onSuccess: refetch,
  });

  const { contentStatus } = useContentStatus();

  const handleCreate = () => router.push("/movies/create");
  const handleEdit = (content: ContentDetail) => router.push(`/movies/${content.contentId}/edit`);

  return (
    <div className={layoutStyles.pageContainer}>
      <div className={layoutStyles.header}>
        <h1>Películas</h1>
        <Button variant="animated" onClick={handleCreate}>Nuevo</Button>
      </div>

      <ContentsList
        contents={movies}
        statuses={contentStatus}
        onDelete={removeContent}
        onEdit={handleEdit}
        onUpdateStatus={(id, statusId) => {
          updateContentStatus(id, {statusId});
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