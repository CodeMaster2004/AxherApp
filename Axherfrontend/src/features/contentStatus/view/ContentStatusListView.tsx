"use client";

import { ContentStatus } from "@/entities/types";
import ContentStatusList from "@/features/contentStatus/components/ContentStatusList";
import { useContentStatus, useContentStatusActions } from "@/features/contentStatus/hooks";
import Button from "@/shared/components/ui/Button";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function ContentStatusListView(){
    const router = useRouter();
    const {contentStatus, loading, currentPage, totalPages, nextPage, prevPage, searchTerm, setSearchTerm, refetch} = useContentStatus();
    const fetchData = async () => {
  try {
    await refetch();
  } catch (error) {
    console.log("Error capturado:", error);
    if (error instanceof Error && error.message === "FORBIDDEN") {
      router.replace("/403");
    }
  }
};
    const {
        deleting,
        removeContentStatus,
    } = useContentStatusActions({
        onSuccess: refetch,
    });

    const handleCreate = () => {
        router.push("/contentStatus/create");
    };

    const handleEdit = (status: ContentStatus) => {
        router.push(`/contentStatus/${status.contentStatusId}/edit`);
    };

useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
    return(
        //<ProtectedRoute requiredPermissions={["CONTENT_STATUS:VIEW"]}>
            <div className={layoutStyles.pageContainer}>
                <div className={layoutStyles.header}>
                    <h1>Estados de Películas</h1>
                    <Button variant="animated" onClick={handleCreate}>
                        Nuevo
                    </Button>
                </div>

                <ContentStatusList
                    contentStatus={contentStatus}
                    onDelete={removeContentStatus}
                    onEdit={handleEdit}
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
        //</ProtectedRoute>
    )
}