"use client";

import { ReportStatusRequest } from "@/entities/types";
import { reportStatusService } from "@/features/reportStatus/services/ReportStatusService";
import { useCrudActions } from "@/shared/hooks/useCrudActions";

type Options = {
    onSuccess?: (result?: ReportStatusRequest) => void;
    onError?: (error: unknown) => void;
}

export const useReportStatusActions = (options?: Options) => {

    const crud = useCrudActions(reportStatusService, options);

    return {
        saving: crud.saving,
        deleting: crud.deleting,
        error: crud.error,

        addReportStatus: crud.add,
        editReportStatus: crud.edit,
        removeReportStatus: crud.remove,
    }
}