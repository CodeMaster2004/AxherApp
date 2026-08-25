"use client";

import { SeasonDetail } from "@/entities/types";
import { useContentStatus } from "@/features/contentStatus/hooks";
import SeasonsList from "@/features/seasons/components/SeasonsList";
import { useSeasons, useSeasonsActions } from "@/features/seasons/hooks";
import SerieDetailView from "@/features/series/components/SerieDetailView";
import { useSeries } from "@/features/series/hooks/useSeries";
import Button from "@/shared/components/ui/Button";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SeriesDetailView() {
    const params = useParams();
    const router = useRouter();
    const contentId = params?.contentId ?  Number(params.contentId) : null;
    const common = useTranslations("common");
    const t = useTranslations("series");
    const { series, loading: seriesLoading, error: seriesError } = useSeries({
        contentId: contentId || 0,
        autoFetch: !!contentId,
    });

    const {
        seasons,
        loading: seasonsLoading,
        currentPage,
        totalPages,
        nextPage,
        prevPage,
        searchTerm,
        setSearchTerm,
        refetch: refetchSeasons,

    } = useSeasons({
        seriesId: contentId || 0,
    });

    const { deleting, removeSeason, updateSeasonStatus } = useSeasonsActions(contentId || 0, {
        onSuccess: () => {
            refetchSeasons();
        },
    });

    const {contentStatus} = useContentStatus();

    useEffect(() => {
        if(!contentId){
            router.push("/admin/contents");
        }
    }, [contentId, router]);

    const handleAddSeason = () => {
        router.push(`/admin/series/${contentId}/seasons/create`);
    };

    const handleEditSeason = (season: SeasonDetail) => {
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

    if(seriesLoading){
        return <div className={layoutStyles.loading}>{t("loading")}</div>;
    }

    if(seriesError || !series) {
        return (
            <div className={layoutStyles.pageContainer}>
                <p style={{color: "red"}}>{t("error")}</p>
                <Button onClick={() => router.push("/admin/contents")}>{common("back")}</Button>
            </div>
        );
    }

    return (
        <div className={layoutStyles.pageContainer}>
            <Button variant="secondary" onClick={() => router.push("/admin/contents")}>
                ← {common("back")}
            </Button>

            <SerieDetailView series={series} />

            <div className={layoutStyles.section} style={{ marginTop: '2rem' }}>
                <div className={layoutStyles.header}>
                    <h2>{t("admin.seasonsTitle")}</h2>
                    <Button variant="animated" onClick={handleAddSeason}>{common("new")}</Button>
                </div>

                <SeasonsList
                    seasons={seasons}
                    statuses={contentStatus}
                    onUpdateStatus={(id, statusId) => {
                        updateSeasonStatus(id, {statusId});
                    }}
                    onDelete={removeSeason}
                    onEdit={handleEditSeason}
                    onViewEpisodes={handleViewEpisodes}
                    onCreateEpisode={handleCreateEpisode}
                    deletingId={deleting}
                    loading={seasonsLoading}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onNextPage={nextPage}
                    onPrevPage={prevPage}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    onTranslations={handleTranslations}
                />
            </div>
        </div>
    );
                
}