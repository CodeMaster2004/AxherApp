"use client";

import { Discounts, Page } from "@/entities/types";
import { discountsService } from "@/features/discounts/services/DiscountsService";
import { usePaginatedData } from "@/shared/hooks/usePaginatedData";

type UseDiscountsOptions ={
    initialData?: Page<Discounts>;
};

export const useDiscounts = (options?: UseDiscountsOptions) => {

    const pagination = usePaginatedData<Discounts>(
        discountsService.getAll,
        {
            initialData: options?.initialData,
            initialSort: "discountId,desc",
            initialSize: 10,
        }
    );

    return{
        discounts: pagination.data,
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
    }

}