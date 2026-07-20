import { notFound } from "next/navigation";

import { API_URL } from "@/core/api/axiosClient";
import { ContentDetail } from "@/entities/types";


import MovieDetail from "@/features/movies/components/MovieDetail";
import styles from "./page.module.css";

export const revalidate = 60;

async function getMovie(contentId: string): Promise<ContentDetail | undefined> {
  try {
    const res = await fetch(`${API_URL}/public/contents/${contentId}`, {
      next: {
        tags: ["peliculas", `pelicula-${contentId}`],
      },
    });

    if (!res.ok) return undefined;

    return await res.json();
  } catch {
    return undefined;
  }
}

interface PageProps {
  params: Promise<{
    contentId: string;
  }>;
}

export default async function MovieDetailPage({ params }: PageProps) {
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