import { ContentStatusResponse } from "@/entities/types/content.types";
import { CreateSeason, SeasonDetail, UpdateSeason } from "@/entities/types/season.types";

export interface SeriesDetail{
    contentId: number;
    title: string;
    description: string;
    posterUrl: string;
    trailerUrl: string;
    price: number;
    categories: string[];
    status: ContentStatusResponse;
    discountAmount?: number;
    registeredAt: string; // formato "YYYY-MM-DD"

    seasonCount: number;

    //Datos anididos para series
    seasons: SeasonDetail[];
}

export interface CreateSeries{
    seasons: CreateSeason[];
}

export interface UpdateSeries{
    seasons?: UpdateSeason[];
}