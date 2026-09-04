"use client";

import { EpisodeDetail as Episode, RatingTargetType } from "@/entities/types";
import VideoPlayerModal from "@/features/media/components/VideoPlayerModal";
import { useProtectedMedia } from "@/features/media/hooks/useProtectedMedia";
import { mediaService } from "@/features/media/services/MediaService";
import Rating from "@/features/ratings/components/Rating";
import { useContentRating } from "@/features/ratings/hooks/useContentRating";
import { formatDuration } from "@/shared/utils/formatDuration";
import Image from "next/image";
import { useState } from "react";
import styles from "./EpisodeDetail.module.css";
import { useLocale, useTranslations } from "next-intl";
import { formatYear } from "@/shared/utils/date";


interface Props {
    episode: Episode;
    contentId: number;
}


export default function EpisodeDetail({ episode, contentId }: Props) {

    const episodeUrl = mediaService.getEpisodesStreamUrl(episode.episodeId);
    const {rating, rate} = useContentRating(
        episode.episodeId,
        RatingTargetType.EPISODE
    );
    const [playerSource, setPlayerSource] = useState<string | null>(null);
    const { requireAuth } = useProtectedMedia();
    const t = useTranslations("episodes");
    const locale = useLocale();

    return (

        <>
            <section className={styles.shell}>

                <div className={styles.backdropFrame}>

                    <Image
                        src={episode.thumbnailUrl}
                        alt=""
                        fill
                        className={styles.backdropBlur}
                    />

                    <Image
                        src={episode.thumbnailUrl}
                        alt=""
                        fill
                        className={styles.backdrop}
                    />

                </div>


                <div className={styles.leftShade}/>
                <div className={styles.bottomShade}/>


                <div className={styles.content}>

                    <div className={styles.detail}>


                        {/* NOMBRE PRINCIPAL DE LA SERIE */}
                        <h1 className={styles.title}>
                            {episode.seriesTitle}
                        </h1>



                        {/* SERIE | AÑO | DURACIÓN */}
                        <div className={styles.seriesInfo}>

                            <span className={styles.seriesName}>
                                {episode.seriesTitle}
                            </span>


                            {episode.releaseDate && (
                                <>
                                    <span className={styles.separator}>|</span>

                                    <span className={styles.year}>
                                        {formatYear(episode.releaseDate, locale)}
                                    </span>
                                </>
                            )}


                            {episode.durationSeconds && (
                                <>
                                    <span className={styles.separator}>|</span>

                                    <span className={styles.duration}>
                                        {formatDuration(episode.durationSeconds)}
                                    </span>
                                </>
                            )}

                        </div>


                        {/* TEMPORADA | EPISODIO: TITULO */}
                        <h2 className={styles.episodeTitle}>

                            {t("season")} {episode.seasonNumber} | {t("episode")} {episode.episodeNumber}: {episode.title}

                        </h2>

                        <Rating
                            id={`episode-${episode.episodeId}`}
                            value={rating}
                            onChange={rate}
                        />

                        {/* DESCRIPCIÓN */}
                        <p className={styles.description}>
                            {episode.description ||
                                t("noDescription")}
                        </p>



                        <div className={styles.actions}>

                            <button
                                className={styles.primaryButton}
                                onClick={() => requireAuth(() => setPlayerSource(episodeUrl))}
                            >
                                ▶ {t("watch")}
                            </button>

                        </div>


                    </div>

                </div>

            </section>

            <VideoPlayerModal
                isOpen={!!playerSource}
                onClose={() => setPlayerSource(null)}
                src={playerSource ?? ""}
                title={episode.title} 
                contentId={contentId}
                episodeId={episode.episodeId}
            />
        </>
    )
}