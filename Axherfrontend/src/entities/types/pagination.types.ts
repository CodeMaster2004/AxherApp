import { ContentFilters, ContentType } from "@/entities/types/content.types";
import { MovieFiltersType } from "@/entities/types/movie.types";

export interface Page<T>{
    content: T[]; // Array de elementos de la pagina actual
    pageable: {
        pageNumber: number; // Número de la página (0-based)
        pageSize: number;  // Tamaño de la página
        sort: {
            sorted: boolean;
            unsorted: boolean;
            empty: boolean;
        };
        offset: number;
        paged: boolean;
        unpaged: boolean;
    };
    totalElements: number;    // Total de elementos en todas las páginas
    totalPages: number;       // Total de páginas disponibles
    last: boolean;            // Indica si es la última página
    first: boolean;           // Indica si es la primera página
    size: number;             // Tamaño de la página
    number: number;           // Número de la página actual (0-based)
    numberOfElements: number; // Número de elementos en la página actual
    empty: boolean;           // Indica si la página está vacía
   
}

export interface PaginationParams {
    page?: number;
    size?: number;
    sort?: string;
}

export type ContentQueryParams = PaginationParams & ContentFilters;
export type MovieQueryParams = PaginationParams & MovieFiltersType;
export interface ContentNewParams extends PaginationParams {
    type?: ContentType;
}

export interface SearchParams extends PaginationParams {
    q?: string;
}