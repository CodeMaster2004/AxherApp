"use client";

import PersonCreditCard from "@/features/people/components/PersonCreditCard";
import { useContentPeople } from "@/features/people/hooks/useContentPeople";
import HorizontalCarousel from "@/shared/components/HorizontalCarousel";
import { useTranslations } from "next-intl";
import styles from "./ContentPeopleCarousel.module.css";

interface Props {
    contentId: number;
}

export default function ContentPeopleCarousel({ contentId }: Props) {

    const t = useTranslations("people");

    const {
        contentPersonRoles,
        loading,
    } = useContentPeople({ contentId });

    if(loading) {
        return <p>{t("loading")}</p>;
    }

    if(!contentPersonRoles.length){
        return null;
    }

    return (

        <section className={styles.section}>
            <h2 className={styles.title}>{t("title")}</h2>

            <HorizontalCarousel>
                {contentPersonRoles.map((credit) => (
                    <PersonCreditCard
                        key={credit.contentPersonRoleId}
                        credit={credit}
                    />
                ))}
            </HorizontalCarousel>
        </section>
    )
}