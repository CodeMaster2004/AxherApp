"use client";

import { Page, RatingResponse } from "@/entities/types";
import { ratingsService } from "@/features/ratings/services/ratingsService";
import { usePaginatedData } from "@/shared/hooks/usePaginatedData";

type Options = {
    targetType: string;
    targetId: number;
    initialData?: Page<RatingResponse>;
}

export const useRatingsByTarget = (options: Options) => {

    const pagination = usePaginatedData<RatingResponse>(
        (params, _search, signal) => 
            ratingsService.getByType(
                options.targetType,
                options.targetId,
                params,
                signal
            ),
            {
                initialData: options.initialData,
                initialSize: 10,
            }
    );

    return {
        ratings: pagination.data,
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