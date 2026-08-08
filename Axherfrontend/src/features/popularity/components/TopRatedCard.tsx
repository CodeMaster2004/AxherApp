"use client";

import { TopRatedContent } from "@/entities/types";
import Link from "next/link";
import Image from "next/image";
import styles from "./TopRatedCard.module.css";
import { Star, Users } from "lucide-react";

interface Props {
    content: TopRatedContent;
}

export default function TopRatedCard({ content }: Props) {

    const href =
    content.type === "MOVIE"
        ? `/peliculas/${content.contentId}`
        : `/serie/${content.contentId}`;

    return (
        <article className={styles.card}>
            <Link
                href={href}
                className={styles.cardLink}
            />

            <div className={styles.posterWrap}>

                <Image
                    src={content.posterUrl}
                    alt={content.title}
                    fill
                    className={styles.poster}
                />
            </div>

            <span className={styles.ratingBadge}>
                <Star
                    size={14}
                    fill="currentColor"
                />
                {content.averageRating.toFixed(1)}
            </span>

            <div className={styles.cardBody}>
                <h3 className={styles.title}>
                    {content.title}
                </h3>

                <div className={styles.stats}>
                    
                    <span className={styles.statItem}>
                        <Users size={14}/>
                        {content.totalRatings}
                    </span>
                </div>
               
            </div>
        </article>
    )
}