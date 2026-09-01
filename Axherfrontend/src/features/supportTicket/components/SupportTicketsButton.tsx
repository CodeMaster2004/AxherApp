"use client";

import { Ticket } from "lucide-react";
import { useRouter } from "next/navigation";
import styles from "./SupportTicketsButton.module.css";
import { useTranslations } from "next-intl";

export default function SupportTicketsButton() {

    const router = useRouter();
    const t = useTranslations("supportTickets");
    
    const handleClick = () => {
        router.push("/soporte/tickets");
    }

    return (
        <button
            type="button"
            className={styles.button}
            onClick={handleClick}
            aria-label={t("shortcut.title")}
        >
            <Ticket
                size={22}
                strokeWidth={2}
            />
            <span
                className={styles.label}
            >
                {t("shortcut.title")}
            </span>
        </button>
    )
}