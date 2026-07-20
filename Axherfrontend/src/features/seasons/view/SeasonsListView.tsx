"use client";

import {  SeasonDetail } from "@/entities/types";
import SeasonsList from "@/features/seasons/components/SeasonsList";
import { useSeasons, useSeasonsActions } from "@/features/seasons/hooks";
import Button from "@/shared/components/ui/Button";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import { useParams, useRouter } from "next/navigation";

type Props = {
    seriesId: number;
};


export default function SeasonsListView({ seriesId }: Props) {
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

    const { deleting, removeSeason } = useSeasonsActions(contentId || 0, {
        onSuccess: refetch,
    });

    const handleCreate = () => {
        router.push(`/series/${contentId}/seasons/create`);
    };

    const handleEdit = (season: SeasonDetail) => {
        router.push(`/series/${contentId}/seasons/${season.seasonId}/edit`);
    };
    const handleViewEpisodes = (seasonId: number) => {
    router.push(`/series/${contentId}/seasons/${seasonId}/episodes`);
    };

    const handleCreateEpisode = (seasonId: number) => {
    router.push(`/series/${contentId}/seasons/${seasonId}/episodes/create`);
    };

    return (
        <div className={layoutStyles.pageContainer}>
            <Button variant="secondary" onClick={() => router.push(`/series/${contentId}`)}>
                ← Volver a Serie
            </Button>

            <div className={layoutStyles.header}>
                <h1>Temporadas</h1>
                <Button variant="animated" onClick={handleCreate}>
                    Crear Temporada
                </Button>
            </div>

            <SeasonsList
                seasons={seasons}
                onDelete={removeSeason}
                onEdit={handleEdit}
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
            />
        </div>
    );
}
