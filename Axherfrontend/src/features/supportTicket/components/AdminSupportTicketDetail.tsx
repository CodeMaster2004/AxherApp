"use client";

import SupportMessageForm from "@/features/supportTicket/components/SupportMessageForm";
import SupportMessageList from "@/features/supportTicket/components/SupportMessageList";
import { useAdminSupportMessageActions } from "@/features/supportTicket/hooks/useAdminSupportMessageActions";
import { useSupportMessages } from "@/features/supportTicket/hooks/useSupportMessages";
import { useState } from "react";
import styles from "./AdminSupportTicketDetail.module.css";
import { useAdminSupportMessages } from "@/features/supportTicket/hooks/useAdminSupportMessages";
import AdminSupportMessageList from "@/features/supportTicket/components/AdminSupportMessageList";

interface Props {
    ticketId: number;
}

export default function AdminSupportTicketDetail({
    ticketId,
}: Props) {

    const [message, setMessage] = useState("");

    const {
        refetch,
    } = useAdminSupportMessages(ticketId);

    const {
        saving,
        error,
        sendMessage,
    } = useAdminSupportMessageActions({
        onSuccess: () => {
            setMessage("");
            refetch();
        },
    });

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        const messageTrim = message.trim();

        if (!messageTrim) {
            return;
        }

        await sendMessage(
            ticketId,
            {
                message: messageTrim,
            }
        );
    };

    return (
        <section className={styles.container}>

            <h1 className={styles.title}>
                Ticket #{ticketId}
            </h1>

            <AdminSupportMessageList
                ticketId={ticketId}
            />

            <SupportMessageForm
                message={message}
                setMessage={setMessage}
                onSubmit={handleSubmit}
                saving={saving}
                error={error ?? undefined}
            />

        </section>
    );
}