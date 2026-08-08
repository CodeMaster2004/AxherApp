"use client";

import { UpcomingContent } from "@/entities/types";
import styles from "@/features/upcoming/components/UpcomingCard.module.css"
import { CalendarDays } from "lucide-react";
import Image from "next/image";
import Link from "next/link";


interface UpcomingCardProps {
    UpcomingContent: UpcomingContent;
}

export default function UpcomingCard({ UpcomingContent }: UpcomingCardProps){

    const date = new Date(UpcomingContent.releaseDate)
        .toLocaleDateString("es-PE", {
            day:"numeric",
            month:"short",
            year:"numeric"
        });

    const href =
        UpcomingContent.type === "MOVIE"
            ? `/peliculas/${UpcomingContent.contentId}`
            : `/serie/${UpcomingContent.contentId}`;

            console.log({
    id: UpcomingContent.contentId,
    type: UpcomingContent.type,
    href
});
    return (
        <article className={styles.card}>

        <Link
            href={href}
            className={styles.cardLink}
        ></Link>
            <div className={styles.posterWrap}>
                <Image
                    src={UpcomingContent.posterUrl}
                    alt={UpcomingContent.title}
                    fill
                    className={styles.poster}
                    sizes="(max-width: 768px) 50vw, 20vw"
                />

                <span className={styles.badge}>
                    Próximamente
                </span>
            </div>


            <div className={styles.cardBody}>
                <h3 className={styles.title}>
                    {UpcomingContent.title}
                </h3>
                <span className={styles.date}>
                    <CalendarDays size={14}/>
                    {date}
                </span>
            </div>
        </article>
    )
}