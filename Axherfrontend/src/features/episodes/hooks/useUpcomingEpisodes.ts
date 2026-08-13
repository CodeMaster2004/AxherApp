"use client";

import { Page, PaginationParams, UpcomingEpisode } from "@/entities/types";
import { episodesService } from "@/features/episodes/services/EpisodesService";
import { usePaginatedData } from "@/shared/hooks/usePaginatedData";
import { useCallback } from "react";

type UseUpcomingEpisodesOptions = {
    initialData?: Page<UpcomingEpisode>
}

export const useUpcomingEpisodes = (
    seasonId: number,
    options?: UseUpcomingEpisodesOptions
) => {

    const fetchUpcoming = useCallback(
        (
            params: PaginationParams,
            _search?: string,
            signal?: AbortSignal
        ) => {
            return episodesService.getUpcomingBySeasonId(seasonId, params, signal);
        },
        [seasonId]
    );

    const pagination = usePaginatedData<UpcomingEpisode>(
        fetchUpcoming,
        {
            initialData: options?.initialData,
            initialSort: "releaseDate,asc",
            initialSize: 10
        }
    );

    return {
        upcomingEpisodes: pagination.data,
        loading: pagination.loading,

        currentPage: pagination.currentPage,
        totalPages: pagination.totalPages,
        totalElements: pagination.totalElements,

        nextPage: pagination.nextPage,
        prevPage: pagination.prevPage,
        goToPage: pagination.goToPage,

        isFirstPage: pagination.isFirstPage,
        isLastPage: pagination.isLastPage,

        refetch: pagination.refetch,
    }
}