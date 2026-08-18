"use client";

import SupportMessageItem from "@/features/supportTicket/components/SupportMessageItem";
import { useAdminSupportMessages } from "@/features/supportTicket/hooks/useAdminSupportMessages";

interface Props {
    ticketId: number;
}

export default function AdminSupportMessageList({
    ticketId,
}: Props) {

    const {
        messages,
        loading,
        error,
        refetch,
    } = useAdminSupportMessages(ticketId);

    if (loading) {
        return <div>Cargando mensajes...</div>;
    }

    if (error) {
        return (
            <div>
                <p>Error al cargar los mensajes.</p>

                <button onClick={refetch}>
                    Reintentar
                </button>
            </div>
        );
    }

    if (messages.length === 0) {
        return <p>No hay mensajes.</p>;
    }

    return (
        <section>
            <h2>Conversación</h2>

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