"use client";

import { TrendingContent } from "@/entities/types";
import { Eye, Flame, User } from "lucide-react";
import styles from "./TrendingCard.module.css";
import Image from "next/image";
import Link from "next/link";

interface TrendingCardProps {
    content: TrendingContent;
    rank: number;
}

export default function TrendingCard({ content, rank }: TrendingCardProps) {

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
            <span className={styles.score}>
                    <Flame size={14} fill="currentColor"/> 
                    #{rank}
                    <small>Tendencia</small>
                </span>

            <div className={styles.cardBody}>
                <h3 className={styles.title}>
                    {content.title}
                </h3>

                <div className={styles.stats}>
                    <span className={styles.statItem}>
                        <Eye
                            size={14}
                        />
                        {content.totalViews}
                    </span>
                    <span className={styles.statItem}>
                        <User
                            size={14}
                        />
                        {content.uniqueUsers}
                    </span>
                </div>
                
            </div>
        </article>
    )

}