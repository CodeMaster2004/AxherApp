import { EpisodeDetail, Page, PaginationParams } from "@/entities/types";
import { episodesService } from "@/features/episodes/services/EpisodesService";
import { usePaginatedData } from "@/shared/hooks/usePaginatedData";
import { useCallback } from "react";

type Props = {
    seasonId:number;
    initialData?:Page<EpisodeDetail>;
}


export function usePublicEpisodes({
    seasonId,
    initialData
}:Props){


    const fetchFn = useCallback(
        (
            params:PaginationParams,
            search?:string,
            signal?:AbortSignal
        )=>{

            return episodesService.getBySeasonId(
                seasonId,
                params,
                signal
            );

        },
        [seasonId]
    );


    const pagination = usePaginatedData<EpisodeDetail>(
        fetchFn,
        {
            initialData,
            initialSort:"episodeNumber,asc",
            initialSize:10
        }
    );


    return {

        episodes: pagination.data,

        loading: pagination.loading,
        error: pagination.error,

        refetch: pagination.refetch
    }

}