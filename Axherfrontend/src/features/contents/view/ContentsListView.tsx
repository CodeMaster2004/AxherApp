"use client";

import { ContentDetail } from "@/entities/types";
import ContentsList from "@/features/contents/components/ContentsList";
import { useContents, useContentsActions } from "@/features/contents/hooks";
import { useContentStatus } from "@/features/contentStatus/hooks";
import Button from "@/shared/components/ui/Button";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import { useRouter } from "next/navigation";


export default function ContentsListView() {
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
    } = useContents();

    const {deleting, removeContent, updateContentStatus} = useContentsActions({
        onSuccess: refetch,
    });

    const {contentStatus} = useContentStatus();

    const handleCreate = () => {
        router.push("/contents/create");
    };

    const handleEdit = (content: ContentDetail) => {
        router.push(`/contents/${content.contentId}/edit`);
    };

    const handleViewSeries = (content: ContentDetail) => {
        router.push(`/series/${content.contentId}`);
    };

    return (
        <div className={layoutStyles.pageContainer}>
            <div className={layoutStyles.header}>
                <h1>Contenidos</h1>
                <Button variant="animated" onClick={handleCreate}>
                    Crear Contenido
                </Button>
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