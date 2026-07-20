import { ratingsApi } from "@/core/api/endpoints/RatingsApi";
import { Page, PaginationParams, RatingRequest, RatingResponse, RatingSummary } from "@/entities/types";

export const ratingsService = {

    getById: async(id: number, signal?: AbortSignal): Promise<RatingResponse> => {
        const res = await ratingsApi.getById(id, { signal });
        return res.data;
    },
    getByUser: async(userId: number, params: PaginationParams, signal?: AbortSignal): Promise<Page<RatingResponse>> => {
        const res = await ratingsApi.getByUser(userId, params, { signal });
        return res.data;
    },

    getByType: async(targetType: string, targetId: number, params: PaginationParams, signal?: AbortSignal): Promise<Page<RatingResponse>> => {
        const res = await ratingsApi.getByType(targetType, targetId, params, { signal });
        return res.data;
    },

    getSummary: async(
        targetType:string,
        targetId:number,
        signal?:AbortSignal
    ):Promise<RatingSummary> => {
        const res = await ratingsApi.getSummary(
            targetType,
            targetId,
            {signal}
        );
        return res.data;
    },
    
    create: async(data: Omit<RatingRequest, "ratingId">, signal?: AbortSignal): Promise<RatingResponse> => {
        const res = await ratingsApi.create(data, { signal });
        return res.data;
    },

    update: async(id: number, data: Partial<RatingRequest>, signal?: AbortSignal): Promise<RatingResponse> => {
        const res = await ratingsApi.update(id, data, { signal });
        return res.data;
    },

    delete: async(id: number, signal?: AbortSignal): Promise<void> => {
        await ratingsApi.delete(id, { signal });
    },
    
    getUserRating: async(
        userId: number,
        targetType: string,
        targetId: number,
        signal?: AbortSignal
    ): Promise<RatingResponse> => {

        const res = await ratingsApi.getUserRating(
            userId,
            targetType,
            targetId,
            { signal }
        );

        return res.data;
    },
}