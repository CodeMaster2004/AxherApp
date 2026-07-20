"use client";

import { Page, SystemRoles } from "@/entities/types";
import { systemRolesService } from "@/features/systemRoles/services/SystemRolesService";
import { usePaginatedData } from "@/shared/hooks/usePaginatedData";

type UseSytemRolesOptions = {
    initialData?: Page<SystemRoles>;
}

export const useSystemRoles = (options?: UseSytemRolesOptions) => {

    const pagination = usePaginatedData<SystemRoles>(

        systemRolesService.getAll,
        {
            initialData: options?.initialData,
            initialSort: "systemRoleId,desc",
            initialSize: 10,
        }
    );

    return {
        systemRoles: pagination.data,
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