import { Page, SystemPermissions } from "@/entities/types";
import { systemPermissionsService } from "@/features/systemPermissions/services/SystemPermissionsService";
import { usePaginatedData } from "@/shared/hooks/usePaginatedData";

type useSystemPermissionsOptions = {
    initialData?: Page<SystemPermissions>;
    initialSize?: number;
}

export const useSystemPermissions = (options?: useSystemPermissionsOptions) => {
    
    const pagination = usePaginatedData<SystemPermissions>(
        systemPermissionsService.getAll,
        {
            initialData: options?.initialData,
            initialSort: "systemPermissionId,desc",
            initialSize: options?.initialSize ?? 10,
        }
    )

    return {
        systemPermissions: pagination.data,
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