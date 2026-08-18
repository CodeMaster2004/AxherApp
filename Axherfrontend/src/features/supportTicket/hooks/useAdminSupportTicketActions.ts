"use client";

import { SupportTicketResponse, TicketStatusRequest } from "@/entities/types";
import { adminSupportTicketService } from "@/features/supportTicket/service/AdminSupportTicketService";
import { useState } from "react";

interface Options {
    onSuccess?: ( ticket: SupportTicketResponse ) => void;
    onError?: ( error: unknown) => void;
}

export const useAdminSupportTicketActions = (
    options?: Options
) => {

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateStatus = async (
        ticketId: number,
        data: TicketStatusRequest
    ) => {

        try {

            setSaving(true);
            setError(null);

            const response =
                await adminSupportTicketService.updateStatus(
                    ticketId,
                    data
                );

            options?.onSuccess?.(response);

            return response;

        } catch (err) {

            const message =
                err instanceof Error
                    ? err.message
                    : "No se pudo actualizar el estado del ticket.";

            setError(message);

            options?.onError?.(err);

        } finally {

            setSaving(false);

        }
    };

    return {
        saving,
        error,
        updateStatus,
    };
};