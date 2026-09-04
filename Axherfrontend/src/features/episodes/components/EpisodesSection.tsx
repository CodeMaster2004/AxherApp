"use client";
import { EpisodeDetail } from "@/entities/types";
import Image from "next/image";
import styles from "./EpisodesSection.module.css";
import { usePublicEpisodes } from "@/features/episodes/hooks/usePublicEpisodes";
import { useUpcomingEpisodes } from "@/features/episodes/hooks/useUpcomingEpisodes";
import { Lock } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { formatDate } from "@/shared/utils/date";

interface Props {
    seasonId: number;
    onSelectEpisode: (episode: EpisodeDetail) => void;
}

export default function EpisodesSection({
    seasonId, onSelectEpisode
}: Props) {

    const {
        episodes,
        loading
    } = usePublicEpisodes({
        seasonId
    });

     const {
        upcomingEpisodes,
        loading: upcomingLoading
    } = useUpcomingEpisodes(seasonId);

    const locale = useLocale();
    const t = useTranslations("episodes");

    return (
        <section className={styles.container}>
            <div className={styles.grid}>

                {episodes.map((episode) => (
                    <article
                        key={episode.episodeId}
                        className={styles.card}
                        onClick={() => onSelectEpisode(episode)}
                    >
                        <div className={styles.thumbnail}>

                            {episode.thumbnailUrl ? (
                                <Image
                                    src={episode.thumbnailUrl}
                                    alt={episode.title}
                                    width={300}
                                    height={200}
                                />
                            ) : (
                                <div className={styles.placeholder}>
                                    {t("episode")} {episode.episodeNumber}
                                </div>
                            )}

                            <div className={styles.placeholder}>
                                {t("episode")} {episode.episodeNumber}
                            </div>

                        </div>

                        <div className={styles.info}>

                            <span className={styles.number}>
                                {t("episode")} {episode.episodeNumber}
                            </span>

                            <h3>{episode.title}</h3>

                            <p>
                                 {episode.description} 
                            </p>

                        </div>

                    </article>
                ))}
                {/* EPISODIOS PRÓXIMOS */}

                {upcomingEpisodes.map((episode) => (

                    <article
                        key={episode.episodeId}
                        className={`${styles.card} ${styles.upcomingCard}`}
                        
                    >

                        <div className={styles.thumbnail}>

                            {episode.thumbnailUrl ? (
                                <Image
                                    src={episode.thumbnailUrl}
                                    alt={episode.title}
                                    width={300}
                                    height={200}
                                />
                            ) : (
                                <div className={styles.placeholder}>
                                    {t("episode")} {episode.episodeNumber}
                                </div>
                            )}

                            <div className={styles.upcomingOverlay}>
                                <Lock className={styles.lockIcon}/>
                            </div>

                        </div>

                        <div className={styles.info}>

                            <span className={styles.number}>
                                {t("episode")} {episode.episodeNumber}
                            </span>

                            <h3>
                                {episode.title}
                            </h3>

                            <p className={styles.releaseDate}>
                                {formatDate(
                                    episode.releaseDate,
                                    locale
                                )}
                            </p>

                        </div>

                    </article>

                ))}

            </div>
        </section>
    );
}