import { API_URL } from "@/core/api/axiosClient";
import { SeriesDetail } from "@/entities/types";
import SeriesDetailContainer from "@/features/series/components/SeriesDetailContainer";
import { notFound } from "next/navigation";
import styles from "./page.module.css";

export const revalidate = 60;

async function getSerie(contentId: string): Promise<SeriesDetail | undefined> {
    try {
    const url = `${API_URL}/series/${contentId}`;

    console.log("URL:", url);

    const res = await fetch(url);

    console.log("STATUS:", res.status);

    if (!res.ok) return undefined;

    return await res.json();
  } catch (e) {
    console.error(e);
    return undefined;
  }
}

interface PageProps {
	params: Promise<{
		contentId: string;
	}>;
}

export default async function SerieDetailPage({ params }: PageProps) {
	const { contentId } = await params;

	const series = await getSerie(contentId);

	if (!series) {
		notFound();
	}

	return (
		<main className={styles.page}>
		<SeriesDetailContainer series={series} />
		</main>
	);
}