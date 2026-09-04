"use client";

import { CinematicRoleResponse, Page } from "@/entities/types";
import { cinematicRoleService } from "@/features/cinematicRole/services/cinematicRoleService";
import { usePaginatedData } from "@/shared/hooks/usePaginatedData";

type UseCinematicRoleOptions = {
    initialData?: Page<CinematicRoleResponse>;
};

export const useCinematicRole = (
    options?: UseCinematicRoleOptions
) => {

    const pagination = usePaginatedData<CinematicRoleResponse>(
        cinematicRoleService.getAll,
        {
            initialData: options?.initialData,
            initialSort: "cinematicRoleId,desc",
            initialSize: 10,
        }
    );

    return {
        cinematicRoles: pagination.data,

        loading: pagination.loading,

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
    };
};