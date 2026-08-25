"use client";

import {  SeasonDetail } from "@/entities/types";
import { useContentStatus } from "@/features/contentStatus/hooks";
import SeasonsList from "@/features/seasons/components/SeasonsList";
import { useSeasons, useSeasonsActions } from "@/features/seasons/hooks";
import Button from "@/shared/components/ui/Button";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";

type Props = {
    seriesId: number;
};


export default function SeasonsListView({ seriesId }: Props) {
    const t = useTranslations("seasons");
    const common = useTranslations("common");
    const router = useRouter();
    const params = useParams();
    const contentId = params?.contentId ? Number(params.contentId) : null;

    const {
        seasons,
        loading,
        currentPage,
        totalPages,
        nextPage,
        prevPage,
        searchTerm,
        setSearchTerm,
        refetch,
    } = useSeasons({
        seriesId
    });

    const { deleting, removeSeason, updateSeasonStatus } = useSeasonsActions(contentId || 0, {
        onSuccess: refetch,
    });

    const {contentStatus} = useContentStatus();

    const handleCreate = () => {
        router.push(`/admin/series/${contentId}/seasons/create`);
    };

    const handleEdit = (season: SeasonDetail) => {
        router.push(`/admin/series/${contentId}/seasons/${season.seasonId}/edit`);
    };
    const handleViewEpisodes = (seasonId: number) => {
    router.push(`/admin/series/${contentId}/seasons/${seasonId}/episodes`);
    };

    const handleCreateEpisode = (seasonId: number) => {
    router.push(`/admin/series/${contentId}/seasons/${seasonId}/episodes/create`);
    };

    const handleTranslations = (season: SeasonDetail) => {
            router.push(`/admin/series/${contentId}/seasons/${season.seasonId}/translations`);
    };

    return (
        <div className={layoutStyles.pageContainer}>
            <Button variant="secondary" onClick={() => router.push(`/admin/contents`)}>
                ← {common("back")}
            </Button>

            <div className={layoutStyles.header}>
                <h1>{t("title")}</h1>
                <Button variant="animated" onClick={handleCreate}>
                    {common("create")}
                </Button>
            </div>

            <SeasonsList
                seasons={seasons}
                statuses={contentStatus}
                onDelete={removeSeason}
                onEdit={handleEdit}
                onUpdateStatus={(id, statusId) => {
                    updateSeasonStatus(id, {statusId});
                }}
                onViewEpisodes={handleViewEpisodes}
                onCreateEpisode={handleCreateEpisode}
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
    );
}
