import { API_URL } from "@/core/api/axiosClient";
import { ContentDetail, Page } from "@/entities/types";

import MovieCard from "@/features/movies/components/MovieCard";

import styles from "./page.module.css";

export const revalidate = 60;

function emptyPage<T>(): Page<T> {
  return {
    content: [],
    pageable: {
      pageNumber: 0,
      pageSize: 12,
      sort: { sorted: false, unsorted: true, empty: true },
      offset: 0,
      paged: true,
      unpaged: false,
    },
    totalElements: 0,
    totalPages: 0,
    last: true,
    first: true,
    size: 12,
    number: 0,
    numberOfElements: 0,
    empty: true,
  };
}

async function getMovies(): Promise<Page<ContentDetail> | undefined> {
  try {
    const res = await fetch(
      `${API_URL}/public/contents/search?page=0&size=12&sort=contentId,desc&type=MOVIE`,
      {
        next: {
          tags: ["peliculas"],
        },
      }
    );

    if (res.status === 204) return emptyPage();

    if (!res.ok) throw new Error();

    return res.json();
  } catch {
    return undefined;
  }
}

export default async function PeliculasPage() {
  const movies = await getMovies();

  const items = movies?.content ?? [];

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.kicker}>
          Catálogo público
        </p>

        <h1 className={styles.title}>
          Películas
        </h1>

        <p className={styles.subtitle}>
          Explora las películas disponibles desde el backend.
        </p>
      </header>

      <section className={styles.grid}>
        {items.length === 0 ? (
          <p className={styles.empty}>
            No hay películas disponibles.
          </p>
        ) : (
          items.map((movie) => (
            <MovieCard
              key={movie.contentId}
              movie={movie}
            />
          ))
        )}
      </section>
    </main>
  );
}