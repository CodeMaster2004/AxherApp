"use client";

import { ContentDetail, ContentType } from "@/entities/types";
import ContentsList from "@/features/contents/components/ContentsList";
import { useContents } from "@/features/contents/hooks/useContents";
import { useContentsActions } from "@/features/contents/hooks/useContentsActions";
import { useContentStatus } from "@/features/contentStatus/hooks";
import Button from "@/shared/components/ui/Button";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import { useRouter } from "next/navigation";


export default function SeriesListView() {
    const router = useRouter();

    const {
        contents,
        loading,
        currentPage,
        totalPages,
        nextPage,
        prevPage,
        searchTerm,
        setSearchTerm,
        refetch,
    } = useContents({
        initialFilters: {
            type: ContentType.SERIE,
        },
    });

    const { deleting, removeContent, updateContentStatus } = useContentsActions({
        onSuccess: refetch,
    });

    const { contentStatus } = useContentStatus();

    const handleCreate = () => {
        router.push("/contents/create?type=SERIE");
    };

    const handleViewSeries = (content: ContentDetail) => {
        router.push(`/series/${content.contentId}`);
    };

    const handleEdit = (content: ContentDetail) => {
        router.push(`/contents/${content.contentId}/edit`);
    };

    const handleViewSeasons = (content: ContentDetail) => {
    router.push(`/series/${content.contentId}/seasons`);
    };

    const handleCreateSeason = (content: ContentDetail) => {
    router.push(`/series/${content.contentId}/seasons/create`);
    };

    return (
        <div className={layoutStyles.pageContainer}>
            <div className={layoutStyles.header}>
                <h1>Series</h1>
                <Button variant="animated" onClick={handleCreate}>Nuevo</Button>
            </div>
            <ContentsList
                contents={contents}
                statuses={contentStatus}
                onUpdateStatus={(id, statusId) => {
                    updateContentStatus(id, {statusId});
                }}
                onDelete={removeContent}
                onEdit={handleEdit}
                onView={handleViewSeries}
                onViewSeasons={handleViewSeasons}
                onCreateSeason={handleCreateSeason}
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