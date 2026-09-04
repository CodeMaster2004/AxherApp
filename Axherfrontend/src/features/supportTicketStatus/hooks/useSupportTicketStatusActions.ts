"use client";

import { SupportTicketStatusRequest, SupportTicketStatusResponse } from "@/entities/types";
import { supportTicketStatusService } from "@/features/supportTicketStatus/service/SupportTicketStatusService";
import { useCrudActions } from "@/shared/hooks/useCrudActions";


type Options = {
    onSuccess?: (result?: SupportTicketStatusResponse) => void;
    onError?: (error: unknown) => void;
}

export const useSupportTicketStatusActions = (options?: Options) => {

    const crud = useCrudActions(supportTicketStatusService, options);

    return {
        saving: crud.saving,
        deleting: crud.deleting,
        error: crud.error,

        addSupportTicketStatus: crud.add,
        editSupportTicketStatus: crud.edit,
        removeSupportTicketStatus: crud.remove,
    }
}