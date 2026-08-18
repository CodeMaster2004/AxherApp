"use client";

import { SupportMessageResponse } from "@/entities/types";
import {  formatTime } from "@/shared/utils/date";
import styles from "./SupportMessageItem.module.css";

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
    const isUser = message.senderType === "USER";

    const senderLabel =
        viewer === "ADMIN"
            ? isUser
                ? "Usuario"
                : "Tú"
            : isUser
                ? "Tú"
                : "Soporte";


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
                        {formatTime(message.sentAt)}
                    </small>
                </div>

                <p className={styles.text}>
                    {message.message}
                </p>
            </div>
        </article>
    );
}