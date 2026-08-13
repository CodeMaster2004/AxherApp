"use client";

import WatchlistGrid from "@/features/watchlist/components/WatchlistGrid";
import { useWatchlist } from "@/features/watchlist/hooks/useWatchlist";
import Pagination from "@/shared/components/ui/Pagination";
import styles from "./WatchlistPage.module.css"


export default function WatchlistView() {

    const {
        watchlist,
        loading,
        currentPage,
        totalPages,
        nextPage,
        prevPage,
        goToPage,
        refetch
    } = useWatchlist();

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1>Mi lista</h1>
            </div>
            <WatchlistGrid
                items={watchlist}
                loading={loading}
                onRemoved={refetch}
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