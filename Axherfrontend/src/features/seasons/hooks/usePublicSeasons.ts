import { Page, PaginationParams, SeasonDetail } from "@/entities/types";
import { seasonsService } from "@/features/seasons/services/SeasonsService";
import { usePaginatedData } from "@/shared/hooks/usePaginatedData";
import { useCallback } from "react";

type Props = {
    seriesId:number;
    initialData?: Page<SeasonDetail>;
}


export function usePublicSeasons({
    seriesId,
    initialData
}:Props){

    const fetchFn = useCallback(
        (
            params:PaginationParams,
            search?:string,
            signal?:AbortSignal
        )=>{

            return seasonsService.getBySeriesId(
                seriesId,
                params,
                signal
            );

        },
        [seriesId]
    );


    const pagination = usePaginatedData<SeasonDetail>(
        fetchFn,
        {
            initialData,
            initialSort:"seasonNumber,asc",
            initialSize:10
        }
    );


    return {

        seasons: pagination.data,

        loading: pagination.loading,
        error: pagination.error,

        currentPage: pagination.currentPage,
        totalPages: pagination.totalPages,

        nextPage: pagination.nextPage,
        prevPage: pagination.prevPage,

        refetch: pagination.refetch
    }

}