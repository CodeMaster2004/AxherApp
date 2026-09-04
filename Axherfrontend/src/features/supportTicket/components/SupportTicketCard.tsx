"use client";

import { SupportTicketResponse } from "@/entities/types";
import { formatDate } from "@/shared/utils/date";
import styles from "./SupportTicketCard.module.css";
import { useLocale, useTranslations } from "next-intl";

interface Props {
    ticket: SupportTicketResponse;
    onClick?: () => void;
}

export default function SupportTicketCard({
    ticket,
    onClick,
}: Props) {

    const t = useTranslations("supportTickets");
    const locale = useLocale();

    return (
        <article
            className={styles.card}
            onClick={onClick}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={(e) => {
                if (!onClick) return;

                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onClick();
                }
            }}
        >

            <div className={styles.top}>

                <div className={styles.subjectWrapper}>

                    <h3 className={styles.subject}>
                        {ticket.subject}
                    </h3>

                    <span className={styles.ticketId}>
                        #{ticket.supportTicketId}
                    </span>

                </div>

                <span className={styles.status}>
                    {ticket.supportTicketStatusName}
                </span>

            </div>

            <div className={styles.meta}>

                <span className={styles.category}>
                    {ticket.supportCategoryName}
                </span>

                <span className={styles.date}>
                    {t("list.created")} {formatDate(ticket.createdAt, locale)}
                </span>

                {ticket.updatedAt && (
                    <span className={styles.date}>
                        {t("list.updated")} {formatDate(ticket.updatedAt, locale)}
                    </span>
                )}

            </div>

            {onClick && (
                <div className={styles.footer}>
                    <span>
                        {t("list.viewConversation")}
                    </span>

                    <span className={styles.arrow}>
                        →
                    </span>
                </div>
            )}

        </article>
    );
}