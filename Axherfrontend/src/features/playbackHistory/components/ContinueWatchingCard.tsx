"use client";

import { ContentType, ContinueWatching } from "@/entities/types";
import Image from "next/image";
import styles from "./ContinueWatchingCard.module.css";
import Link from "next/link";
import { Play } from "lucide-react";

interface Props {
    content: ContinueWatching;
}

export default function ContinueWatchingCard({ content }: Props) {

    return (

        <article className={styles.card}>

            <Link
                href={`/content/${content.contentId}`}
                className={styles.cardLink}
            />

            <div className={styles.posterWrap}>
                <Image
                    src={content.backdropUrl}
                    alt={content.title}
                    fill
                    className={styles.poster}
                />

                <div className={styles.playButton}>
                    <Play size={22} fill="white"/>
                </div>

                <div className={styles.progressBar}>
                    <div
                        className={styles.progress}
                        style={{width:`${content.progress}%`}}
                    />
                </div>
            </div>

            <div className={styles.cardBody}>
                <h3 className={styles.title}>
                    {content.title}
                </h3>

                {
                    content.contentType === ContentType.SERIE && (
                        <p className={styles.episode}>
                            T{content.seasonNumber} .
                            E{content.episodeNumber} - {content.episodeTitle}
                        </p>
                    )
                }

               
            </div>
        </article>
    )
}