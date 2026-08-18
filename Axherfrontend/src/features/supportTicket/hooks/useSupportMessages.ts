"use client";

import { SupportMessageResponse } from "@/entities/types";
import { supportMessageService } from "@/features/supportTicket/service/SupportMessageService";
import { useCallback, useEffect, useState } from "react";

export const useSupportMessages = (ticketId?: number) => {

    const [messages, setMessages] = useState<SupportMessageResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<unknown>(null);

    const fetchMessages = useCallback(async () => {

        if (!ticketId) {
            setMessages([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data =
                await supportMessageService.getAllByTicketId(
                    ticketId
                );

            setMessages(data);

        } catch (error) {
            setError(error);

        } finally {
            setLoading(false);
        }

    }, [ticketId]);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    return {
        messages,
        loading,
        error,
        refetch: fetchMessages,
    };
};