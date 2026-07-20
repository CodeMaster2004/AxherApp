"use client";
import Image from "next/image";
import Link from "next/link";

import { ContentDetail, RatingTargetType } from "@/entities/types";

import { useRatingSummary } from "@/features/ratings/hooks/useRatingSummary";
import styles from "./MovieCard.module.css";

interface MovieCardProps {
  movie: ContentDetail;
}

export default function MovieCard({ movie }: MovieCardProps) {

  const {
    summary,
    loading
  }= useRatingSummary(RatingTargetType.CONTENT, movie.contentId);
  return (
    <article className={styles.card}>
      <Link
        href={`/peliculas/${movie.contentId}`}
        className={styles.cardLink}
      >
        <div className={styles.posterWrap}>
          <Image
            src={movie.posterUrl}
            alt={movie.title}
            fill
            className={styles.poster}
            sizes="(max-width: 768px) 50vw, 20vw"
          />
        </div>

        <div className={styles.cardBody}>
          <h2 className={styles.title}>{movie.title}</h2>
          <div className={styles.rating}>


            {
              loading ? (

                <span>
                  Cargando...
                </span>

              ) : (

                <>

                  ⭐ {summary?.averageRating ?? 0}

                  <small>
                    ({summary?.totalRatings ?? 0})
                  </small>

                </>

              )
            }


          </div>
          <p className={styles.description}>
            {movie.description}
          </p>

          <div className={styles.meta}>
            <span>{movie.type}</span>
            <span>{movie.status.status}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}