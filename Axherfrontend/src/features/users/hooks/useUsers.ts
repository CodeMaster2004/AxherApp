"use client";

import { Page, UserList } from "@/entities/types";
import { usersService } from "@/features/users/services/UsersService";
import { usePaginatedData } from "@/shared/hooks/usePaginatedData";

type UseUsersOptions = {
    initialData?: Page<UserList>;
}

export const useUsers = (options?: UseUsersOptions) => {
    const pagination = usePaginatedData<UserList>(
        usersService.getAll, {
            initialData: options?.initialData,
            initialSort: "userId,desc",
            initialSize: 10,
        }
    );

    return {
        users: pagination.data,
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
    };
};