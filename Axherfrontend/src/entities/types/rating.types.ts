export enum RatingTargetType {
    CONTENT = "CONTENT",
    EPISODE = "EPISODE"
}

export interface RatingResponse{
    ratingId: number;
    userId: number;
    targetType: RatingTargetType;
    targetId: number;
    ratingValue: number; // 1 a 5
    comment?: string;
    ratedAt: string; // formato "YYYY-MM-DD"
}

export interface RatingRequest{
    userId: number;
    targetType: RatingTargetType;
    targetId: number;
    ratingValue: number;
    comment?: string;
}

export interface RatingSummary {
    averageRating: number; // Promedio de calificaciones
    totalRatings: number;
}