"use client";

import { SupportTicketResponse } from "@/entities/types";
import SupportMessageForm from "@/features/supportTicket/components/SupportMessageForm";
import SupportMessageList from "@/features/supportTicket/components/SupportMessageList";
import { useSupportMessageActions } from "@/features/supportTicket/hooks/useSupportMessageActions";
import { useSupportMessages } from "@/features/supportTicket/hooks/useSupportMessages";
import { supportTicketService } from "@/features/supportTicket/service/SupportTicketService";
import { useEffect, useState } from "react";
import styles from "./SupportTicketDetail.module.css";

interface Props {
    ticketId: number;
}

export default function SupportTicketDetail({
    ticketId,
}: Props) {

    const [message, setMessage] = useState("");
    const [ticket, setTicket] =
        useState<SupportTicketResponse | null>(null);

    const [loadingTicket, setLoadingTicket] = useState(true);

    const { refetch } = useSupportMessages(ticketId);

    const {
        saving,
        error,
        sendMessage,
    } = useSupportMessageActions({
        onSuccess: () => {
            setMessage("");
            refetch();
        },
    });

    useEffect(() => {

        const loadTicket = async () => {

            try {

                setLoadingTicket(true);

                const data =
                    await supportTicketService.getById(ticketId);

                setTicket(data);

            } catch (error) {

                console.error(
                    "Error al cargar ticket:",
                    error
                );

            } finally {

                setLoadingTicket(false);
            }
        };

        loadTicket();

    }, [ticketId]);

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        const trimmedMessage = message.trim();

        if (!trimmedMessage) {
            return;
        }

        await sendMessage(
            ticketId,
            {
                message: trimmedMessage,
            }
        );
    };

    const isClosed =
        ticket?.supportTicketStatusCode === "CLOSED";

    return (
        <section className={styles.container}>

            <h2 className={styles.header}>
                {ticket?.subject ?? `Ticket #${ticketId}`}
            </h2>

            {!loadingTicket && ticket && (
                <div
                    className={
                        isClosed
                            ? styles.closedNotice
                            : styles.supportNotice
                    }
                >

                    <strong>
                        {isClosed
                            ? "Ticket cerrado"
                            : "Solicitud recibida"
                        }
                    </strong>

                    <p>
                        {isClosed
                            ? "Este ticket ha sido cerrado y ya no puedes enviar nuevos mensajes."
                            : "Tu solicitud fue recibida. El equipo de soporte revisará tu caso y responderá cuando esté disponible."
                        }
                    </p>

                </div>
            )}

            <SupportMessageList
                ticketId={ticketId}
            />

            {!isClosed && (
                <SupportMessageForm
                    message={message}
                    setMessage={setMessage}
                    onSubmit={handleSubmit}
                    saving={saving}
                    error={error ?? undefined}
                />
            )}

        </section>
    );
}