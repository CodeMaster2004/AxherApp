
"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Users } from "lucide-react";

import { ShelfItem, RatingTargetType } from "@/entities/types";
import { useRatingSummary } from "@/features/ratings/hooks/useRatingSummary";

import styles from "./ShelfCard.module.css";

interface ShelfCardProps {
    item: ShelfItem;
}

export default function ShelfCard({
    item
}: ShelfCardProps) {

    const {
        summary,
        loading
    } = useRatingSummary(
        RatingTargetType.CONTENT,
        item.contentId
    );

    const href =
        item.type === "MOVIE"
            ? `/peliculas/${item.contentId}`
            : `/serie/${item.contentId}`;

    return (

        <Link
            href={href}
            className={styles.card}
        >

            <div className={styles.posterWrap}>

                {item.posterUrl ? (

                    <Image
                        src={item.posterUrl}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 40vw, 200px"
                        className={styles.poster}
                    />

                ) : (

                    <div className={styles.placeholder}>
                        🎬
                    </div>

                )}

            </div>


            <span className={styles.ratingBadge}>

                <Star
                    size={14}
                    fill="currentColor"
                />

                {
                    loading
                        ? "..."
                        : (
                            summary?.averageRating ?? 0
                        ).toFixed(1)
                }

            </span>


            <div className={styles.cardBody}>

                <h3 className={styles.title}>
                    {item.title}
                </h3>


                <div className={styles.stats}>

                    <span className={styles.statItem}>

                        <Users size={14} />

                        {
                            summary?.totalRatings ?? 0
                        }

                    </span>


                    <span>
                        {item.type}
                    </span>

                </div>

            </div>

        </Link>
    );
}

