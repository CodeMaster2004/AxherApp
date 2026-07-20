"use client";
import { EpisodeDetail } from "@/entities/types";
import Image from "next/image";
import styles from "./EpisodesSection.module.css";

interface Props {
    episodes: EpisodeDetail[];
    onSelectEpisode: (episode: EpisodeDetail) => void;
}

export default function EpisodesSection({
    episodes, onSelectEpisode
}: Props) {

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
                                    Episodio {episode.episodeNumber}
                                </div>
                            )}

                            <div className={styles.placeholder}>
                                Episodio {episode.episodeNumber}
                            </div>

                        </div>

                        <div className={styles.info}>

                            <span className={styles.number}>
                                Episodio {episode.episodeNumber}
                            </span>

                            <h3>{episode.title}</h3>

                            <p>
                                 {episode.description} 
                            </p>

                        </div>

                    </article>
                ))}

            </div>
        </section>
    );
}