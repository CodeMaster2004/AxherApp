"use client";

import SupportMessageItem from "@/features/supportTicket/components/SupportMessageItem";
import { useAdminSupportMessages } from "@/features/supportTicket/hooks/useAdminSupportMessages";
import { useTranslations } from "next-intl";

interface Props {
    ticketId: number;
}

export default function AdminSupportMessageList({
    ticketId,
}: Props) {

    const t = useTranslations("supportTickets");
    const {
        messages,
        loading,
        error,
        refetch,
    } = useAdminSupportMessages(ticketId);

    if (loading) {
        return <div>{t("messages.loading")}</div>;
    }

    if (error) {
        return (
            <div>
                <p>{t("messages.error")}</p>

                <button onClick={refetch}>
                    {t("messages.retry")}
                </button>
            </div>
        );
    }

    if (messages.length === 0) {
        return <p>{t("messages.empty")}</p>;
    }

    return (
        <section>
            <h2>{t("messages.conversation")}</h2>

            <div>
                {messages.map((message) => (
                    <SupportMessageItem
                        key={message.messageId}
                        message={message}
                        viewer="ADMIN"
                    />
                ))}
            </div>
        </section>
    );
}