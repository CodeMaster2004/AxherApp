"use client";

import { ContentType, TopRatedContent } from "@/entities/types";
import { popularityService } from "@/features/popularity/services/popularityService";
import { useEffect, useState } from "react";

export const useTopRated = (type: ContentType) => {
    const [topRated, setTopRated] = useState<TopRatedContent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        const load = async () => {
            try {
                const data = await popularityService.topRated(
                    type,
                    controller.signal
                );
                setTopRated(data);
            } catch (error) {
                console.error("Error loading top rated content:", error);
            } finally {
                setLoading(false);
            }
        };
        load();
    },[]);

    return { topRated, loading };
}