import { ContentDetail } from "@/entities/types";
import ContentCard from "@/features/contents/components/ContentCard";
import styles from "./ContentGrid.module.css";

interface Props {
    contents: ContentDetail[];
    loading: boolean;
}

export default function ContentGrid({
    contents,
    loading
}: Props) {

    if(loading){
        return <p>cargando...</p>
    }

    if(contents.length === 0) {
        return <p>No se encontraron contenidos</p>
    }

    return (

        <section className={styles.grid}>
            {
                contents.map(content => (
                    <ContentCard
                        key={content.contentId}
                        content={content}
                    />
                ))
            }
        </section>
    )
}