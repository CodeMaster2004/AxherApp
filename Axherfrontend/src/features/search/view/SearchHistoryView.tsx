"use client";

import SearchHistoryList from "@/features/search/components/SearchHistoryList";
import { useSearchHistory } from "@/features/search/hooks/useSearchHistory";
import { useSearchHistoryActions } from "@/features/search/hooks/useSearchHistoryActions";
import Pagination from "@/shared/components/ui/Pagination";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";

export default function SearchHistoryView() {

    const {
        searchHistory,
        loading,
        currentPage,
        totalPages,
        nextPage,
        prevPage,
        goToPage,
        refetch,
    } = useSearchHistory();

    const {deleting, remove, clearing, clear } = useSearchHistoryActions({onSuccess: refetch});

    const handleSelect = (term: string) => {
        console.log("Selected search term:", term);
    }

    return (
        <div className={layoutStyles.pageContainer}>
            <div className={layoutStyles.header}>
                <h1>Historial de busqueda</h1>
            </div>

            <SearchHistoryList
                items={searchHistory}
                loading={loading}
                onSelect={handleSelect}
                onRemove={remove}
                deleting={deleting}
                onClear={clear}
                clearing={clearing}
            />

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPrevPage={prevPage}
                onNextPage={nextPage}
                onGoToPage={goToPage}
            />
        </div>

    )
}