"use client";

import { SupportMessageRequest, SupportMessageResponse } from "@/entities/types";
import { supportMessageService } from "@/features/supportTicket/service/SupportMessageService";
import { useState } from "react";

interface Options {
    onSuccess?: (message: SupportMessageResponse) => void;
    onError?: (error: unknown) => void;
}

export const useSupportMessageActions = (
    options?: Options
) => {

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sendMessage = async (
        ticketId: number,
        data: SupportMessageRequest
    ) => {

        try {

            setSaving(true);
            setError(null);

            const response =
                await supportMessageService.sendMessage(
                    ticketId,
                    data
                );

            options?.onSuccess?.(response);

            return response;

        } catch (err) {

            const message =
                err instanceof Error
                    ? err.message
                    : "No se pudo enviar el mensaje.";

            setError(message);

            options?.onError?.(err);

        } finally {

            setSaving(false);
        }
    };

    return {
        saving,
        error,
        sendMessage,
    };
};