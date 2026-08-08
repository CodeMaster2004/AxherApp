import MoviesCatalog from "@/features/movies/components/MoviesHome";
import styles from "./page.module.css";

export default async function MoviesPage() {

  return (

        <main className={styles.page}>

             <MoviesCatalog />

        </main>

    )

}