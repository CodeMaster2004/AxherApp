import { notFound } from "next/navigation";

import { ContentDetail } from "@/entities/types";
import { serverApiFetch } from "@/core/api/serverApiClient";

import MovieDetail from "@/features/movies/components/MovieDetail";
import styles from "./page.module.css";

export const revalidate = 60;

async function getMovie(
    contentId: string
): Promise<ContentDetail | undefined> {

    try {
        return await serverApiFetch<ContentDetail>(
            `/contents/${contentId}`,
            {
                next: {
                    tags: [
                        "peliculas",
                        `pelicula-${contentId}`,
                    ],
                },
            }
        );

    } catch {
        return undefined;
    }
}

interface PageProps {
    params: Promise<{
        contentId: string;
    }>;
}

export default async function MovieDetailPage({
    params,
}: PageProps) {

    const { contentId } = await params;

    const movie = await getMovie(contentId);

    if (!movie || movie.type !== "MOVIE") {
        notFound();
    }

    return (
        <main className={styles.page}>
            <MovieDetail movie={movie} />
        </main>
    );
}