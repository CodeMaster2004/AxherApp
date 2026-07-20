"use client";

import { RatingSummary, RatingTargetType } from "@/entities/types";
import { ratingsService } from "@/features/ratings/services/ratingsService";
import { useEffect, useState } from "react";

export function useRatingSummary(
    targetType: RatingTargetType,
    targetId: number
){
    const [summary, setSummary] = useState<RatingSummary | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() =>{

        const controller = new AbortController();

        setLoading(true);

        ratingsService.getSummary(
            targetType,
            targetId,
            controller.signal
        )
        .then(data => {
            setSummary(data);
        })
        .catch(() => {
            setSummary({
                averageRating:0,
                totalRatings:0
            });
        })
        .finally(() => {
            setLoading(false);
        });

        return () => controller.abort();
    },[
        targetType,
        targetId
    ]);

    return {
        summary,
        loading
    }
}