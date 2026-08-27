"use client";

import { WatchlistResponse } from "@/entities/types";
import WatchlistCard from "./WatchlistCard";
import styles from "./WatchlistGrid.module.css";
import { useTranslations } from "next-intl";

type WatchlistGridProps = {
    items: WatchlistResponse[];
    loading?: boolean;
    onRemoved?: () => void;
};

export default function WatchlistGrid({
    items,
    loading,
    onRemoved
}: WatchlistGridProps) {

    const t = useTranslations("watchlist");

    if (loading) {
        return (
            <div className={styles.message}>
                {t("loading")}
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className={styles.empty}>
                <h2>{t("empty.title")}</h2>
                <p>
                    {t("empty.text")}
                </p>
            </div>
        );
    }

    return (
        <div className={styles.grid}>
            {items.map((item) => (
                <WatchlistCard
                    key={item.watchlistId}
                    item={item}
                    onRemoved={onRemoved}
                />
            ))}
        </div>
    );
}