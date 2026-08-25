"use client";

import { ReportCategoryResponse } from "@/entities/types/reportCategory.types";
import { reportCategoryService } from "@/features/ReportCategory/services/ReportCategoryService";
import { useCrudActions } from "@/shared/hooks/useCrudActions";

type Options = {
    onSuccess?: (result?: ReportCategoryResponse) => void;
    onError?: (error: unknown) => void;
};

export const useReportCategoryActions = (
    options?: Options
) => {

    const crud = useCrudActions(
        reportCategoryService,
        options
    );

    return {
        saving: crud.saving,
        deleting: crud.deleting,
        error: crud.error,

        addReportCategory: crud.add,
        editReportCategory: crud.edit,
        removeReportCategory: crud.remove,
    };
};