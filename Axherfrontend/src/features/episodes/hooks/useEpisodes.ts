import { EpisodeDetail, Page, PaginationParams } from "@/entities/types";
import { episodesService } from "@/features/episodes/services/EpisodesService";
import { usePaginatedData } from "@/shared/hooks/usePaginatedData";
import { useCallback, useState } from "react";

type UseEpisodesInit = {
    seasonId: number;
    initialData?: Page<EpisodeDetail>;
    initialSort?: string;
}

export function useEpisodes({ seasonId, initialData, initialSort = "episodeNumber,asc"}: UseEpisodesInit) {
    const [sort, setSort] = useState(initialSort);

    const fetchFn = useCallback((
        params: PaginationParams,
        search?: string,
        signal?: AbortSignal
    ) => {
        return episodesService.getBySeasonId(seasonId,{
            ...params,
            sort: sort || params.sort
        },signal );

    },
    [seasonId, sort]);

    const pagination = usePaginatedData<EpisodeDetail>(fetchFn, {
        initialData,
        initialSort,
        initialSize: 10,
    });

    const updateSort = (newSort: string) =>{
        setSort(newSort);
        pagination.goToPage(0);
    };

    return {
        episodes: pagination.data,
        loading: pagination.loading,
        error: pagination.error,

        currentPage: pagination.currentPage,
        pageSize: pagination.pageSize,
        totalPages: pagination.totalPages,
        totalElements: pagination.totalElements,
        nextPage: pagination.nextPage,
        prevPage: pagination.prevPage,
        goToPage: pagination.goToPage,
        refetch: pagination.refetch,

        sort,
        setSort: updateSort,

        searchTerm: pagination.searchTerm,
        setSearchTerm: pagination.setSearchTerm,
    }

    
}