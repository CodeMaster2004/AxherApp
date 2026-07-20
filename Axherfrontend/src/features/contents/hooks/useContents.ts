import { ContentDetail, ContentFilters, ContentQueryParams, ContentType, Page } from "@/entities/types";
import { contentService } from "@/features/contents/services/ContentService";
import { usePaginatedData } from "@/shared/hooks/usePaginatedData";
import { useCallback, useState } from "react";


type Filters = ContentFilters &{
    offers?: boolean;
}

type UseContentsInit = {
    initialData?: Page<ContentDetail>;
    initialFilters?: Partial<Filters>
}

export function useContents(initial?: UseContentsInit){
    const initialSort = "contentId,desc";

    const [filters, setFilters] = useState<Filters>({
        ...initial?.initialFilters
    });

    const fetchFn = useCallback((
        params: ContentQueryParams,
        search?: string,
        signal?: AbortSignal
    ) => {

        const finalParams: ContentQueryParams = {
            ...params,
            title: search || params.title,
            categoryId: filters.categoryId,
            statusId: filters.statusId,
            discountAmount: filters.discountAmount,
            type: filters.type,
        };
        if(filters.offers) {
            return contentService.getWithDiscount(params, signal);
        }

        if(
           filters.categoryId != null ||
           filters.statusId != null ||
           filters.discountAmount != null ||
           filters.type != null
        ){
            return contentService.search(
                finalParams,
                signal
            );
        }
        return contentService.getAll(finalParams, search, signal);
    },
    [filters]);

    const pagination = usePaginatedData<ContentDetail>(fetchFn, {
        initialData: initial?.initialData,
        initialSort,
        initialSize: 10,
    });

    const setSearch = (value: string) =>{
        pagination.setSearchTerm(value)
    }

    const setCategory = (id?: number) => {
        setFilters(f => ({...f, categoryId: id}));
        pagination.goToPage(0);
    }

    const setStatus = (id?: number) => {
        setFilters(f => ({...f, statusId: id}));
        pagination.goToPage(0);
    }

    const setType = (type?: ContentType) => {
    setFilters(f => ({
        ...f,
        type
    }));

    pagination.goToPage(0);
}

    const setDiscountAmount = (amount?: number) => {
        setFilters(f => ({...f, discountAmount: amount}));
        pagination.goToPage(0);
    }

    const setOffers = (val: boolean) => {
        setFilters(f => ({...f, offers: val}));
        pagination.goToPage(0);
    }

    const setSort = (sort: string) => {
        setFilters(f => ({...f, sort}));
        pagination.goToPage(0);
    }

    const setFiltersPartial = (patch: Partial<Filters>) => {
        setFilters(f => ({...f, ...patch}));
        pagination.goToPage(0);
    }

    const resetFilters = () => {
        setFilters({});
        pagination.setSort(initialSort);
        pagination.goToPage(0);
    }

    return{
        contents: pagination.data,
        loading: pagination.loading,
        error: pagination.error,
        
        currentPage: pagination.currentPage,
        pageSize: pagination.pageSize,
        totalPages: pagination.totalPages,
        totalElements: pagination.totalElements,
        nextPage: pagination.nextPage,
        prevPage: pagination.prevPage,
        goToPage: pagination.goToPage,
        refetch: pagination.refetch,

        filters,
        setSearch,
        setCategory,
        setStatus,
        setType,
        setDiscountAmount,
        setOffers,
        setSort,
        setFiltersPartial,
        resetFilters,

        searchTerm: pagination.searchTerm,
        setSearchTerm: pagination.setSearchTerm,
    };
}