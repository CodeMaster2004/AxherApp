"use client";

import { ContentStatus, Page } from "@/entities/types";
import { contentStatusService } from "@/features/contentStatus/services/ContentStatusService";
import { usePaginatedData } from "@/shared/hooks/usePaginatedData";

type UseContentStatusOptions = {
    initialData?: Page<ContentStatus>;
}

export const useContentStatus = (options?: UseContentStatusOptions) => {

   const pagination = usePaginatedData<ContentStatus>(
    
        contentStatusService.getAll,
        {
            initialData: options?.initialData,
            initialSort: "contentStatusId,desc",
            initialSize: 10,
        }
   );

   return{
        contentStatus: pagination.data,
        loading: pagination.loading,
        
        currentPage: pagination.currentPage,
        totalPages: pagination.totalPages,
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