"use client";

import { SupportFaqResponse } from "@/entities/types/supportFaq.types";
import Accordion from "@/shared/components/ui/Accordion";
import styles from "./SupportFaqAccordion.module.css"

interface Props {
    faqs: SupportFaqResponse[];
}

export default function SupportFaqAccordion({
    faqs,
}: Props) {
    return (
        <section className={styles.container}>
            {faqs.map(faq => (
                <Accordion
                    key={faq.supportFaqId}
                    title={faq.question}
                >
                    <p>{faq.answer}</p>
                </Accordion>
            ))}
        </section>
    )
}