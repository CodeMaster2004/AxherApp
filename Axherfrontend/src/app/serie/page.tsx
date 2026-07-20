import { API_URL } from "@/core/api/axiosClient";
import { ContentDetail, Page } from "@/entities/types";
import SerieCard from "@/features/series/components/SerieCard";
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
    
async function getSeries(): Promise<Page<ContentDetail> | undefined> {
    try {
        const res = await fetch(
            `${API_URL}/public/contents/search?page=0&size=12&sort=contentId,desc&type=SERIE`,
            {
                next: {
                    tags: ["series"],
                }
            }

        );
        
        if (res.status ===204) return emptyPage();

        if (!res.ok) throw new Error();

        return res.json();
    }catch {
        return undefined;
    }
}

export default async function SeriesPage() {
    const series = await getSeries();

    const items = series?.content ?? [];

    return (
        <main className={styles.page}>
            <header className={styles.hero}>
                <p className={styles.kicker}>
                    Catálogo Público
                </p>
                <h1 className={styles.title}>
                    Series
                </h1>
                <p className={styles.subtitle}>
                    Expora las peliculas disponibles en nuestro catálogo público. Encuentra una amplia variedad de películas para todos los gustos y géneros. Disfruta de la mejor selección de contenido cinematográfico en un solo lugar.
                </p>
            </header>
            <section className={styles.grid}>
                {items.length === 0 ? (
                    <p className={styles.empty}>
                        No se encontraron series.
                    </p>
                ) : (
                    items.map((serie) => (
                        <SerieCard
                            key={serie.contentId}
                            serie={serie}
                        />
                    ))
                )}
                        
            </section>

        </main>
    )
}