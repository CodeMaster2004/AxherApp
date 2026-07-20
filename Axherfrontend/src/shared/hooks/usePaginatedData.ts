"use client";

import { Page, PaginationParams } from "@/entities/types";
import { useCallback, useEffect, useRef, useState } from "react";

type UsePaginatedDataOptions<T> = {
    initialData?: Page<T>;
    initialPage?: number;
    initialSize?: number;
    initialSort?: string;
}

export function usePaginatedData<T>(
    fetchFn: (
        params: PaginationParams,
        search?: string,
        signal?: AbortSignal
    ) => Promise<Page<T>>,

    options?: UsePaginatedDataOptions<T>
){
    //Estados de datos paginados
    const [data, setData] = useState<T[]>(options?.initialData?.content ?? []);
    const [currentPage, setCurrentPage] = useState(options?.initialPage ?? 0);
    const pageSize = options?.initialSize ?? 10;
    const [sort, setSort,] = useState(options?.initialSort ?? "id");
    const [totalPages, setTotalPages] = useState(options?.initialData?.totalPages ?? 0);
    const [totalElements, setTotalElements] = useState(options?.initialData?.totalElements ?? 0);
    const hasSkippedInitialFetch = useRef(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    //Estados de carga
    const [loading, setLoading] = useState(!options?.initialData);
    const [error, setError] = useState<Error | null>(null);

    //Fetch paginado
    const fetchPage = useCallback(
        async (params: PaginationParams, signal?: AbortSignal) => {
            try{
                setLoading(true);
                setError(null);
                const result = await fetchFn({
                    size: pageSize,
                    sort,
                    ...params
                },
                
                debouncedSearch,
                signal
                
            );

                setData(result.content);
                setTotalPages(result.totalPages);
                setTotalElements(result.totalElements);
                setCurrentPage(result.number);
            } catch(err: unknown){
                if(err instanceof Error && err.name !== "AbortError" && err.name !== "CanceledError"){
                    setError(err);
                    console.error("Error al obtener datos paginados: ", err);
                                }
            }finally{
                setLoading(false);
            }
        },
        [fetchFn, pageSize, sort, debouncedSearch]
    );

    //Navegacion
    const goToPage = useCallback((page: number) => {
        if(page >= 0 && page < totalPages){
            setCurrentPage(page);
        }
    }, [totalPages]);

    const nextPage = useCallback(() => {

        if(currentPage < totalPages - 1){
            setCurrentPage((prev) => prev + 1);
        }
    }, [currentPage, totalPages]);

    const prevPage = useCallback(() => {
        if(currentPage > 0){
            setCurrentPage((prev) => prev -1);
        }
    }, [currentPage]);

    const refetch = useCallback(() => {
        fetchPage({page: currentPage});
    }, [fetchPage, currentPage]);

    // Debounce para búsqueda (espera 400ms después de que el usuario deja de escribir)
    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 400);

        return () => clearTimeout(timeout);
    }, [searchTerm]);

    // Resetear a página 0 cuando cambia el término de búsqueda debounced
    useEffect(() => {
            setCurrentPage(0);
    }, [debouncedSearch, sort]);

    // Auto-fetch cuando cambia la pagina
    useEffect(() => {
        // Si hay datos iniciales SSR, saltamos solo el primer render
        if (options?.initialData && !hasSkippedInitialFetch.current) {
            hasSkippedInitialFetch.current = true;
            return;
        }

        const controller = new AbortController();
        fetchPage({page: currentPage}, controller.signal);

        return () => controller.abort();
    }, [currentPage, fetchPage, options?.initialData]);

    return{
        data,
        currentPage,
        pageSize,
        totalPages,
        totalElements,
        loading,
        error,
        goToPage,
        nextPage,
        prevPage,
        refetch,
        isFirstPage: currentPage === 0,
        isLastPage: currentPage === totalPages -1,
        searchTerm,
        setSearchTerm,
        sort,
        setSort
    };


}