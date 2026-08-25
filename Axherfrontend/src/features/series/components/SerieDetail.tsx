import { ContentStatusResponse, EpisodeDetail, RatingTargetType, SeriesDetail } from "@/entities/types";
import VideoPlayerModal from "@/features/media/components/VideoPlayerModal";
import Rating from "@/features/ratings/components/Rating";
import { useContentRating } from "@/features/ratings/hooks/useContentRating";
import Image from "next/image";
import { useState } from "react";
import styles from "./SerieDetail.module.css";
import WatchlistButton from "@/features/watchlist/components/WatchlistButton";
import { useTranslations } from "next-intl";

interface SeriesDetailProps {
    series: SeriesDetail;
    statuses: ContentStatusResponse[];
    onSelectEpisode:(episode: EpisodeDetail)=>void;
}

function getYear(date?: string) {
  if (!date) return undefined;

  return new Date(date).getFullYear();
}

export default function SerieDetail({ series }: SeriesDetailProps) {
  
  const releaseYear = getYear(series.registeredAt);
    const {rating, rate} = useContentRating(
        series.contentId,
        RatingTargetType.CONTENT
    );
    const [playerSource, setPlayerSource] = useState<string | null>(null);
    const t = useTranslations("series");
    
    return (

        <>
            <section className={styles.shell}>
                <div className={styles.backdropFrame}>
                    <Image
                        src={series.posterUrl}
                        alt=""
                        fill
                        className={styles.backdropBlur}
                        sizes="(max-width: 900px) 100vw, 72vw"
                        priority
                    />

                    <Image
                        src={series.posterUrl}
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
                    <div className={styles.detail}>
                        <h1 className={styles.title}>
                            {series.title}
                        </h1>

                        <div className={styles.metaLine}>
                            <strong>{series.title}</strong>
                            {series.categories.length > 0 && (
                                <>
                                    <span aria-hidden="true">|</span>
                                    <span>{series.categories.join(", ")}</span>
                                </>
                            )}
                            {releaseYear && <span>{releaseYear}</span>}
                            {series.status && (
                                <span className={styles.ageBadge}>{series.status.code}</span>
                            )}
                        </div>
                        <Rating
                            id={`series-${series.contentId}`}
                            value={rating}
                            onChange={rate}
                        />
                        <p className={styles.description}>
                            {series.description || t("detail.noDescription")}
                        </p>

                        
                        <div className={styles.actions}>
                            {series.trailerUrl && (
                                <button
                                    className={styles.primaryButton}
                                    onClick={() => setPlayerSource(series.trailerUrl)}
                                >
                                    {t("detail.watchTrailer")}
                                </button>
                            )}
                            <WatchlistButton contentId={series.contentId} />
                        </div>
                    </div>
                </div>
            </section>
           <VideoPlayerModal
                isOpen={!!playerSource}
                onClose={() => setPlayerSource(null)}
                src={playerSource ?? ""}
                title={series.title} contentId={0}            />

        </>
        
    )
}