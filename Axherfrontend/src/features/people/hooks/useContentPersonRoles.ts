"use client";

import {
    ContentPersonRoleResponse,
    Page,
} from "@/entities/types";
import { contentPersonRoleService } from "@/features/people/services/contentPersonRoleService";
import { usePaginatedData } from "@/shared/hooks/usePaginatedData";
import { useCallback } from "react";

type UseContentPersonRoleOptions = {
    contentId: number;
    initialData?: Page<ContentPersonRoleResponse>;
};

export const useContentPersonRoles = (
    options: UseContentPersonRoleOptions
) => {

    const fetchContentPersonRoles = useCallback(
        (
            params: Parameters<
                typeof contentPersonRoleService.getAll
            >[1],
            search?: string,
            signal?: AbortSignal
        ) => {
            return contentPersonRoleService.getAll(
                options.contentId,
                params,
                search,
                signal
            );
        },
        [options.contentId]
    );

    const pagination =
        usePaginatedData<ContentPersonRoleResponse>(
            fetchContentPersonRoles,
            {
                initialData: options.initialData,
                initialSort: "orderIndex,asc",
                initialSize: 10,
            }
        );

    return {
        contentPersonRoles: pagination.data,
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