"use client";

import { ProblemReportRequest, ProblemReportResponse } from "@/entities/types/problemReport.types";
import { problemReportService } from "@/features/reports/services/ProblemReportService";
import { useCrudActions } from "@/shared/hooks/useCrudActions";

type Options = {
    onSuccess?: (result?: ProblemReportResponse) => void;
    onError?: (error: unknown) => void;
}

export const useProblemReportActions = (options?: Options) => {
    const crud = useCrudActions< 
        ProblemReportResponse, 
        ProblemReportRequest 
    >( 
        problemReportService, options 
    );

    return {
        saving: crud.saving,
        deleting: crud.deleting,
        error: crud.error,
        
        addProblemReport: crud.add,
        removeProblemReport: crud.remove,
    }
}