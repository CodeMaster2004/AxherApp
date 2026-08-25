"use client";

import { ContentStatusResponse } from "@/entities/types/status.types";
import ContentStatusList from "@/features/contentStatus/components/ContentStatusList";
import { useContentStatus, useContentStatusActions } from "@/features/contentStatus/hooks";
import Button from "@/shared/components/ui/Button";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function ContentStatusListView(){
    const router = useRouter();
    const common = useTranslations("common");
    const t = useTranslations("contentStatus");
    const {contentStatus, loading, currentPage, totalPages, nextPage, prevPage, searchTerm, setSearchTerm, refetch} = useContentStatus();
   
    const {
        deleting,
        removeContentStatus,
    } = useContentStatusActions({
        onSuccess: refetch,
    });

    const handleCreate = () => {
        router.push("/admin/contentStatus/create");
    };

    const handleEdit = (status: ContentStatusResponse) => {
        router.push(`/admin/contentStatus/${status.contentStatusId}/edit`);
    };

    const handleTranslations = (status: ContentStatusResponse) => {
        router.push(`/admin/contentStatus/${status.contentStatusId}/translations`);
    };


    return(
            <div className={layoutStyles.pageContainer}>
                <div className={layoutStyles.header}>
                    <h1>{t("list.title")}</h1>
                    <Button variant="animated" onClick={handleCreate}>
                        {common("new")}
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
                    onTranslations={handleTranslations}
                />
            </div>
    )
}