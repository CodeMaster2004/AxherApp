"use client";

import SupportMessageItem from "@/features/supportTicket/components/SupportMessageItem";
import { useSupportMessages } from "@/features/supportTicket/hooks/useSupportMessages";

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

    if (loading) {
        return <div>Cargando mensajes...</div>;
    }

    if (error) {
        return (
            <div>
                <p>Error al cargar los mensajes.</p>
                <button onClick={refetch}>Reintentar</button>
            </div>
        )
    }

    if(messages.length === 0) {
        return <p>NO hay mensajes.</p>
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