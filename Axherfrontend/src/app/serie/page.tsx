import styles from "./page.module.css";
import SeriesHome from "@/features/series/components/SeriesHome";


export default async function SeriesPage() {
   

    return (
        <main className={styles.page}>
            <SeriesHome></SeriesHome>

        </main>
    )
}