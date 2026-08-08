"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Users } from "lucide-react";

import { ContentDetail, RatingTargetType } from "@/entities/types";
import { useRatingSummary } from "@/features/ratings/hooks/useRatingSummary";

import styles from "./MovieCard.module.css";


interface MovieCardProps {
    movie: ContentDetail;
}


export default function MovieCard({
    movie
}: MovieCardProps) {


const {
    summary,
    loading
} = useRatingSummary(
    RatingTargetType.CONTENT,
    movie.contentId
);



return (

<article className={styles.card}>


    <Link
        href={
            movie.type === "MOVIE"
            ? `/peliculas/${movie.contentId}`
            : `/serie/${movie.contentId}`
        }
        className={styles.cardLink}
    />


    <div className={styles.posterWrap}>

        <Image
            src={movie.posterUrl}
            alt={movie.title}
            fill
            className={styles.poster}
        />

    </div>



    <span className={styles.ratingBadge}>

        <Star
            size={14}
            fill="currentColor"
        />

        {
            loading
            ? "..."
            : (summary?.averageRating ?? 0).toFixed(1)
        }

    </span>



    <div className={styles.cardBody}>

        <h3 className={styles.title}>
            {movie.title}
        </h3>


        <div className={styles.stats}>


            <span className={styles.statItem}>

                <Users size={14}/>

                {
                    summary?.totalRatings ?? 0
                }

            </span>


            <span>
                {movie.type}
            </span>


        </div>


    </div>


</article>

)

}