"use client";

import { SupportTicketRequest, SupportTicketResponse } from "@/entities/types";
import { supportTicketService } from "@/features/supportTicket/service/SupportTicketService";
import { useCrudActions } from "@/shared/hooks/useCrudActions";

type Options = {
    onSuccess?: (result?: SupportTicketResponse) => void;
    onError?: (error: unknown) => void;
};

export const useSupportTicketActions = (
    options?: Options
) => {

    const crud = useCrudActions<
        SupportTicketResponse,
        SupportTicketRequest
    >(
        supportTicketService,
        options
    );

    return {
        saving: crud.saving,
        error: crud.error,

        createTicket: crud.add,
    };
};