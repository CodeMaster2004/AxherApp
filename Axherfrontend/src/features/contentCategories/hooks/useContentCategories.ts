"use client";

import { ContentCategoryResponse, Page } from "@/entities/types";
import { contentCategoriesService } from "@/features/contentCategories/services/ContentCategoriesService";
import { usePaginatedData } from "@/shared/hooks/usePaginatedData";

type UseContentCategoriesOptions = {
  initialData?: Page<ContentCategoryResponse>;
};

export const useContentCategories = (options?: UseContentCategoriesOptions) => {
  //hook generico de paginacion: trae data paginada y helpers
  const pagination = usePaginatedData<ContentCategoryResponse>(
    contentCategoriesService.getAll, //funcion que trae Page<T>
    {
      initialData: options?.initialData,//datos SSR si existen
      initialSort: "contentCategoryId,desc", //orden descendente (más recientes primero)
      initialSize: 10,               //tamanio de pagina 
    }
  );

  return{
    contentCategories: pagination.data, //items de la pagina actual
    loading: pagination.loading,         //loading global
    
    currentPage: pagination.currentPage,
    totalPages: pagination.totalPages,
    totalElements: pagination.totalElements,
    nextPage: pagination.nextPage,
    prevPage: pagination.prevPage,
    goToPage: pagination.goToPage,
    isFirstPage: pagination.isFirstPage,
    isLastPage: pagination.isLastPage,

    searchTerm: pagination.searchTerm,
    setSearchTerm: pagination.setSearchTerm,

   
    refetch: pagination.refetch,
  }
}