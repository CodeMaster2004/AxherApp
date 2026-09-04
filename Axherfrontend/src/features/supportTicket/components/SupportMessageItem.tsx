"use client";

import { SupportMessageResponse } from "@/entities/types";
import {  formatTime } from "@/shared/utils/date";
import styles from "./SupportMessageItem.module.css";
import { useLocale, useTranslations } from "next-intl";

interface Props {
    message: SupportMessageResponse;
}
interface Props {
    message: SupportMessageResponse;
    viewer?: "USER" | "ADMIN";
}
export default function SupportMessageItem({
    message,
    viewer = "USER",
}: Props) {
    const t = useTranslations("supportTickets");
    const isUser = message.senderType === "USER";
    const locale = useLocale();

    const senderLabel =
        viewer === "ADMIN"
            ? isUser
                ? t("messages.user")
                : t("messages.you")
            : isUser
                ? t("messages.you")
                : t("messages.support");


    return (
        <article
            className={`${styles.message} ${
                isUser
                    ? styles.messageUser
                    : styles.messageAgent
            }`}
        >
            <div
                className={`${styles.bubble} ${
                    isUser
                        ? styles.userBubble
                        : styles.agentBubble
                }`}
            >
                <div className={styles.header}>
                    <strong className={styles.sender}>
                        {senderLabel}
                    </strong>

                    <small className={styles.date}>
                        {formatTime(message.sentAt, locale)}
                    </small>
                </div>

                <p className={styles.text}>
                    {message.message}
                </p>
            </div>
        </article>
    );
}