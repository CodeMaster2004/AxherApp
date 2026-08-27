import { ContentDetail } from "@/entities/types";
import ContentCard from "@/features/contents/components/ContentCard";
import styles from "./ContentGrid.module.css";
import { useTranslations } from "next-intl";

interface Props {
    contents: ContentDetail[];
    loading: boolean;
}

export default function ContentGrid({
    contents,
    loading
}: Props) {

    const common = useTranslations("common");
    const t = useTranslations("contents");
    
    console.log("GRID", {
        loading,
        count: contents.length,
        ids: contents.map(x => x.contentId)
    });
    if (loading) {
    return (
        <div style={{
            padding: "2rem",
            color: "red",
            fontSize: "2rem"
        }}>
            {common("loading")}
        </div>
    );
}

    if(contents.length === 0) {
        return <p>{t("filters.noResults")}</p>
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