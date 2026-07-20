import { ContentDetail } from "@/entities/types";
import Image from "next/image";
import Link from "next/link";
import styles from "./SerieCard.module.css";

interface SerieCardProps {
    serie: ContentDetail;
}

export default function SerieCard({ serie }: SerieCardProps) {
    return (
        <article className={styles.card}>
            <Link href={`/serie/${serie.contentId}`}
                className={styles.cardLink}
                >
                    <div className={styles.posterWrap}>
                        <Image
                            src={serie.posterUrl}
                            alt={serie.title}
                            fill
                            className={styles.poster}
                            sizes="(max-width: 768px) 50vw, 20vw"
                        />
                    </div>

                    <div className={styles.cardBody}>
                        <h2 className={styles.title}>{serie.title}</h2>
                        <p className={styles.description}>
                            {serie.description}
                        </p>

                        <div className={styles.meta}>
                            <span>{serie.type}</span>
                            <span>{serie.status.status}</span>
                        </div>
                    </div>
            </Link>
        </article>
    );
}