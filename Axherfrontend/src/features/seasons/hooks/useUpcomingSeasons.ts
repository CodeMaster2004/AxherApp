"use client";

import { UpcomingSeason } from "@/entities/types";
import { seasonsService } from "@/features/seasons/services/SeasonsService";
import { useEffect, useState } from "react";

export const useUpcomingSeasons = (seriesId: number) => {

    const [upcomingSeasons, setUpcomingSeasons] = useState<UpcomingSeason[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();

        const load = async () => {

            setLoading(true);

            try {
                const data = await seasonsService.getUpcomingBySeriesId(
                    seriesId,
                    controller.signal
                );
                setUpcomingSeasons(data);
            } catch (error) {
                if (!controller.signal.aborted) {
                    console.error(
                        "Error loading upcoming seasons:",
                        error
                    );
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };
        load();
        
        return () => {
            controller.abort();
        };
    }, [seriesId]);

    return { upcomingSeasons, loading };
}