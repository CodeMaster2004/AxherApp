import { Page, PaginationParams, SeasonDetail } from "@/entities/types";
import { seasonsService } from "@/features/seasons/services/SeasonsService";
import { usePaginatedData } from "@/shared/hooks/usePaginatedData";
import { useCallback, useState } from "react";



type UseSeasonsInit = {
    seriesId: number;
    initialData?: Page<SeasonDetail>;
    initialSort?: string;
}

export function useSeasons({ seriesId, initialData, initialSort = "seasonNumber,asc" }: UseSeasonsInit){

    const [sort, setSort] = useState(initialSort);

    const fetchFn = useCallback((
        params: PaginationParams,
        search?: string,
        signal?: AbortSignal
    ) => {
        return seasonsService.getBySeriesId(seriesId, { ...params, sort }, signal );

    },
    [seriesId, sort]);

    const pagination = usePaginatedData<SeasonDetail>(fetchFn, {
        initialData,
        initialSort,
        initialSize: 10,
    });

    const updateSort = (newSort: string) =>{
        setSort(newSort);
        pagination.goToPage(0);
    }

    return {
        seasons: pagination.data,
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


    };
}