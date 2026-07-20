import { SeriesDetail } from "@/entities/types";
import { seriesService } from "@/features/series/services/SeriesService";
import { useCallback, useEffect, useState } from "react";



type UseSeriesOptions = {
    contentId: number;
    autoFetch?: boolean;
}

export function useSeries({contentId, autoFetch = true}: UseSeriesOptions){
    const [series, setSeries] = useState<SeriesDetail | null>(null);
    const [loading, setLoading] = useState(autoFetch);
    const [error, setError] = useState<Error | null>(null);

    const fetchSeries = useCallback(async (signal?: AbortSignal) => {

        try{
            setLoading(true);
            setError(null);
            const data = await seriesService.getByContentId(contentId, signal);
            setSeries(data);
        }catch(err: unknown){
            if(err instanceof Error && err.name !== "AbortError" && err.name !== "CanceledError"){
                setError(err);
                console.error("Error al obtener la serie: ", err);
            }
        }finally{
            setLoading(false);
        }
    }, [contentId]);

    const refetch = useCallback(() => {
        fetchSeries();

    }, [fetchSeries]);

    useEffect(() => {
        if(!autoFetch) return;

        const controller = new AbortController();
        fetchSeries(controller.signal);

        return () => controller.abort();

    }, [fetchSeries, autoFetch]);

    return {
        series,
        loading,
        error,
        refetch
    }
}