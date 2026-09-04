"use client";

import { Page, PersonResponse } from "@/entities/types";
import { personService } from "@/features/people/services/personService";
import { usePaginatedData } from "@/shared/hooks/usePaginatedData";

type UsePersonOptions = {
    initialData?: Page<PersonResponse>;
};

export const usePerson = (
    options?: UsePersonOptions
) => {

    const pagination =
        usePaginatedData<PersonResponse>(
            personService.getAll,
            {
                initialData: options?.initialData,
                initialSort: "personId,desc",
                initialSize: 10,
            }
        );

    return {
        people: pagination.data,

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