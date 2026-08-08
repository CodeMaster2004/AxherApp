"use client";

import Image from "next/image";
import Link from "next/link";

import { ContentDetail, RatingTargetType } from "@/entities/types";

import VideoPlayerModal from "@/features/media/components/VideoPlayerModal";
import { useProtectedMedia } from "@/features/media/hooks/useProtectedMedia";
import { mediaService } from "@/features/media/services/MediaService";
import Rating from "@/features/ratings/components/Rating";
import { useContentRating } from "@/features/ratings/hooks/useContentRating";
import { formatDuration } from "@/shared/utils/formatDuration";
import { useState } from "react";
import styles from "./MovieDetail.module.css";

interface MovieDetailProps {
  movie: ContentDetail;
}

function getYear(date?: string) {
  if (!date) return undefined;

  return new Date(date).getFullYear();
}



export default function MovieDetail({ movie }: MovieDetailProps) {
  
  const releaseYear = getYear(movie.registeredAt);
  const duration = formatDuration(movie.durationSeconds);
  const movieUrl = mediaService.getMoviesStreamUrl(movie.contentId);
  const {rating, rate} = useContentRating(
      movie.contentId,
      RatingTargetType.CONTENT
  );
  const [playerSource, setPlayerSource] = useState<string | null>(null);
 const { requireAuth } = useProtectedMedia();
  
  return (
    <>
      <section className={styles.shell}>
        <div className={styles.backdropFrame}>
          <Image
            src={movie.backdropUrl}
            alt=""
            fill
            className={styles.backdropBlur}
            sizes="(max-width: 900px) 100vw, 72vw"
            priority
          />

          <Image
            src={movie.backdropUrl}
            alt=""
            fill
            className={styles.backdrop}
            sizes="(max-width: 900px) 100vw, 70vw"
            priority
          />
        </div>

        <div className={styles.leftShade} />
        <div className={styles.bottomShade} />

        <div className={styles.content}>
          <Link href="/peliculas" className={styles.backLink}>
            ← Volver a películas
          </Link>

          <div className={styles.detail}>

            <h1 className={styles.title}>
              {movie.title}
            </h1>

            <div className={styles.metaLine}>
              <strong>{movie.title}</strong>
              {movie.categories.length > 0 && (
                <>
                  <span aria-hidden="true">|</span>
                  <span>{movie.categories.join(", ")}</span>
                </>
              )}
              {releaseYear && <span>{releaseYear}</span>}
              {movie.status && (
                <span className={styles.ageBadge}>{movie.status.name}</span>
              )}
              {duration && <strong>{duration}</strong>}
            </div>
            <Rating
                id={`movie-${movie.contentId}`}
                value={rating}
                onChange={rate}
            />

            <p className={styles.description}>
              {movie.description || "Sin descripción disponible."}
            </p>

            <div className={styles.subscription}>
              Contenido incluido con PelículasApp.{" "}
              <span>Activa 30 días sin costo</span>
            </div>

            <div className={styles.actions}>
              {movie.trailerUrl && (
                <button
                  
                  className={styles.primaryButton}
                  onClick={() => setPlayerSource(movie.trailerUrl)}
                >
                  Ver tráiler
                </button>
              )}

                <button
                  className={styles.secondaryButton}
                  onClick={() => requireAuth(() => setPlayerSource(movieUrl))}
                >
                  Ver película
                </button>

            </div>
          </div>
        </div>
      </section>
      
     <VideoPlayerModal
          isOpen={!!playerSource}
          onClose={() => setPlayerSource(null)}
          src={playerSource ?? ""}
          title={movie.title}
          contentId={movie.contentId}
      />
    </>
  );
}
