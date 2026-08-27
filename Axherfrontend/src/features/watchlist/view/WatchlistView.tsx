"use client";

import WatchlistGrid from "@/features/watchlist/components/WatchlistGrid";
import { useWatchlist } from "@/features/watchlist/hooks/useWatchlist";
import Pagination from "@/shared/components/ui/Pagination";
import styles from "./WatchlistPage.module.css"
import { useTranslations } from "next-intl";


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

    const t = useTranslations("watchlist");

    return (
        
        <div className={styles.page}>
            <div className={styles.header}>
                <h1>{t("title")}</h1>
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