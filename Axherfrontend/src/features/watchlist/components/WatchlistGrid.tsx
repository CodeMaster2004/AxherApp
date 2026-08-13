"use client";

import { WatchlistResponse } from "@/entities/types";
import WatchlistCard from "./WatchlistCard";
import styles from "./WatchlistGrid.module.css";

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
    if (loading) {
        return (
            <div className={styles.message}>
                Cargando tu lista...
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className={styles.empty}>
                <h2>Tu lista está vacía</h2>
                <p>
                    Agrega películas y series para encontrarlas fácilmente
                    después.
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