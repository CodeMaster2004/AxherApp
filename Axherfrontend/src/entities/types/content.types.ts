import { ContentCategoryResponse } from "@/entities/types/category.types";
import { CreateMovie, UpdateMovie } from "@/entities/types/movie.types";
import { CreateSeries, UpdateSeries } from "@/entities/types/series.types";

export enum ContentType {
    MOVIE = "MOVIE",
    SERIE = "SERIE"
}

export interface ContentDetail{
    contentId: number;
    title: string;
    description: string;
    originalLanguageId: number;
    type: ContentType;
    posterUrl: string;
    backdropUrl: string;
    trailerUrl: string;
    price: number;
    categories: string[];
    status: ContentStatusResponse;
    discountAmount?: number;
    registeredAt: string; // formato "YYYY-MM-DD"
    releaseDate: string;

    //solo si es movie
    durationSeconds?: number;
    movieUrl?: string;

}

export interface CreateContent{
    title: string;
    description: string;
    originalLanguageId: number;
    type: ContentType;
    posterFile: File;
    bacdropFile: File;
    trailerFile: File;
    price: number;
    categoryIds: number[];
    statusId?: number;
    discountId?: number;
    releaseDate: string; // formato "YYYY-MM-DD"

    //Datos especificos degun el tipo
    movie?: CreateMovie;
    series?: CreateSeries;
}

export interface UpdateContent{
    title?: string;
    description?: string;
    type?: ContentType;
    posterFile?: File;
    backdropFile?: File;
    trailerFile?: File;
    price?: number;
    categoryIds?: number[];
    statusId?: number;
    discountId?: number;
    releaseDate?: string; // formato "YYYY-MM-DD"
    //Datos especificos degun el tipo
    movie?: UpdateMovie;
    series?: UpdateSeries;
}

export interface StatusUpdate{
    statusId: number;
}

export interface ContentFeatured {
    contentId: number;
    title: string;
    description: string;
    backdropUrl: string;
    type: ContentType;
}

export interface UpcomingContent {
    contentId: number;
    title: string;
    posterUrl: string;
    backdropUrl: string;
    description: string;
    releaseDate: string; // formato "YYYY-MM-DD"
    categories: string[];
    type: ContentType;
}

export interface ContentFilters {
    title?: string;
    categoryId?: number;
    year?: number;
    statusId?: number;
    discountAmount?: number;
    type?: ContentType;
}

export interface ContentFiltersDto {
    categories: ContentCategoryResponse[];
    years: number[];
}



export interface ContentStatusResponse {
    contentStatusId: number;
    code: string;
    name: string;
}

export interface ContentTranslation {
    contentId: number;
    languageId: number;
    languageCode: string;
    languageName: string;
    title: string;
    description: string;
}

export interface ContentTranslationRequest {
    languageId: number;
    title: string;
    description: string;
}