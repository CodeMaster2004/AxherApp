"use client";

import { ContentDetail, RatingTargetType } from "@/entities/types";
import { useRatingSummary } from "@/features/ratings/hooks/useRatingSummary";
import Image from "next/image";
import Link from "next/link";
import styles from "./ContentCard.module.css";
import { Star } from "lucide-react";

interface Props {
    content: ContentDetail;
}

export default function ContentCard({ content }: Props) {

    const {
        summary,
        loading
    } = useRatingSummary(
        RatingTargetType.CONTENT,
        content.contentId
    );

    const href = 
        content.type === "MOVIE"
        ? `/peliculas/${content.contentId}`
        : `/serie/${content.contentId}`;

    return (

        <article className={styles.card}>
            <Link
                href={href}
                className={styles.link}
            />

            <div className={styles.posterWrap}>
                <Image
                    src={content.posterUrl}
                    alt={content.title}
                    fill
                    className={styles.poster}
                    sizes="220px"
                />
            
                <div className={styles.ratingBadge}>
                    {loading ? (
                        "..."
                    ) : (
                        <>
                            <Star
                                size={14}
                                fill="currentColor"
                                strokeWidth={0}
                            />

                            <span>
                                {summary?.averageRating?.toFixed(1) ?? "0"}
                            </span>

                           
                        </>
                    )}
                </div>
               
            </div>

            <div className={styles.body}>

                <h3 className={styles.title}>
                    {content.title}
                </h3>

                <div className={styles.meta}>
                    {
                        content.categories?.slice(0,2)
                        .map(category => (
                            <span
                                key={category}
                            >
                                {category}
                            </span>
                        ))
                    }
                </div>

            </div>
        </article>
    )
}