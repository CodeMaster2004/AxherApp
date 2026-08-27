"use client";

import Image from "next/image";
import Link from "next/link";

import { WatchlistResponse } from "@/entities/types";
import WatchlistButton from "@/features/watchlist/components/WatchlistButton";
import styles from "./WatchlistCard.module.css";
import { useState } from "react";
import { useWatchlistActions } from "@/features/watchlist/hooks/useWatchlistActions";
import ConfirmDialog from "@/shared/components/ui/ConfirmDialog";
import { useTranslations } from "next-intl";

interface Props {
    item: WatchlistResponse;
    onRemoved?: () => void;
}

export default function WatchlistCard({ item, onRemoved }: Props) {

    const common = useTranslations("common");
    const t = useTranslations("watchlist");

    const [confirmOpen, setConfirmOpen] = useState(false);
    const {
        remove,
        deleting
    } = useWatchlistActions();

    const href =
        item.type === "MOVIE"
            ? `/peliculas/${item.contentId}`
            : `/serie/${item.contentId}`;

    const typeLabel =
        item.type === "MOVIE"
            ? "Película"
            : "Serie";
    const handleRemoveRequest = () => { setConfirmOpen(true); };

    const handleConfirmRemove = async () => {

        try {
            await remove(item.contentId);

            setConfirmOpen(false);

            onRemoved?.();

        } catch {
            // El hook maneja el error.
        }
    };

    const handleCancelRemove = () => {
        if (!deleting) {
            setConfirmOpen(false);
        }
    };

    return (
        <>
        <ConfirmDialog
                isOpen={confirmOpen}
                title={t("remove.title")}
                message={t("remove.message", { title: item.title })}
                confirmText={
                    deleting === item.contentId
                        ? t("remove.loading")
                        : t("remove.button")
                }
                cancelText={common("cancel")}
                onConfirm={handleConfirmRemove}
                onCancel={handleCancelRemove}
                variant="danger"
            />

            <article className={styles.card}>

                <div className={styles.posterWrap}>
                    <Link
                        href={href}
                        className={styles.posterLink}
                        aria-label={`Ver ${item.title}`}
                    />

                    <Image
                        src={item.posterUrl}
                        alt={item.title}
                        fill
                        className={styles.poster}
                        sizes="220px"
                    />

                    <div className={styles.overlay} />
                </div>

                <div className={styles.body}>

                    <div className={styles.info}>

                        <Link
                            href={href}
                            className={styles.titleLink}
                        >
                            <h3 className={styles.title}>
                                {item.title}
                            </h3>
                        </Link>

                        <div className={styles.meta}>
                            <span>{typeLabel}</span>
                        </div>

                    </div>

                    <WatchlistButton
                        contentId={item.contentId}
                        variant="remove"
                        onRemoveRequest={handleRemoveRequest}
                    />

                </div>

            </article>
        </>
    );
}