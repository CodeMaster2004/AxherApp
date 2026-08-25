"use client";

import SupportMessageItem from "@/features/supportTicket/components/SupportMessageItem";
import { useSupportMessages } from "@/features/supportTicket/hooks/useSupportMessages";
import { useTranslations } from "next-intl";

interface Props {
    ticketId: number;
}

export default function SupportMessageList({
    ticketId,
}: Props) {
 
    const {
        messages,
        loading,
        error,
        refetch,
    } = useSupportMessages(ticketId);
    const t = useTranslations("supportTickets");

    if (loading) {
        return <div>{t("messages.loading")}</div>;
    }

    if (error) {
        return (
            <div>
                <p>{t("messages.error")}</p>
                <button onClick={refetch}>{t("messages.retry")}</button>
            </div>
        )
    }

    if(messages.length === 0) {
        return <p>{t("messages.empty")}</p>
    }

    return (
        <section>

            <div>
                {messages.map((message) => (
                    <SupportMessageItem
                        key={message.messageId}
                        message={message}
                    />
                ))}
            </div>
        </section>
    )
}