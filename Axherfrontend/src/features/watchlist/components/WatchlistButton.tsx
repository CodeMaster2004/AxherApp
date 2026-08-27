"use client";

import { useWatchlistActions } from "@/features/watchlist/hooks/useWatchlistActions";
import { Check, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import styles from "./WatchlistButton.module.css";
import { useTranslations } from "next-intl";

type WatchListButtonProps = {
    contentId: number;
    variant?: "default" | "remove";
    onRemoveRequest?: () => void;
};

export default function WatchlistButton({
    contentId,
    variant = "default",
    onRemoveRequest
}: WatchListButtonProps) {

    const [inList, setInList] = useState(false);

    const {
        saving,
        deleting,
        checking,
        isInWatchlist,
        add,
        remove
    } = useWatchlistActions();

    useEffect(() => {

        const checkList = async () => {

            try {
                const result = await isInWatchlist(contentId);
                setInList(result);
            } catch {
                setInList(false);
            }
        };

        checkList();

    }, [contentId, isInWatchlist]);

    const handleToggle = async () => {

        if(variant === "remove"){
            onRemoveRequest?.();
            return;
        }

        try {

            if (inList) {
                await remove(contentId);
                setInList(false);
               
            } else {
                await add(contentId);
                setInList(true);
            }

        } catch {
            // El estado no cambia si la operación falla
        }
    };

    const t = useTranslations("watchlist");

    const loading =
        checking === contentId ||
        saving ||
        deleting === contentId;
    if(variant === "remove") {

        return (
            <button
                type="button"
                className={styles.removeButton}
                onClick={handleToggle}
                disabled={loading}
                aria-label={t("remove.title")}
                title={t("remove.title")}
            >
                <Trash2
                    size={17}
                    strokeWidth={1.8}
                />
            </button>
        )
    }
    
    return (
        <button
            type="button"
            className={`${styles.watchlistButton} ${
                inList ? styles.watchlistButtonActive : ""
            }`}
            onClick={handleToggle}
            disabled={loading}
            aria-label={
                inList
                    ? t("remove.title")
                    : t("add.title")
            }
            title={
                inList
                    ? t("remove.title")
                    : t("add.title")
            }
        >
            {inList ? (
                <Check size={20} strokeWidth={2.2} />
            ) : (
                <Plus size={21} strokeWidth={2.2} />
            )}
        </button>
    );
}