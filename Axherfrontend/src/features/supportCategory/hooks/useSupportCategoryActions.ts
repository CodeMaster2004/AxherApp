"use client";

import { SupportCategoryRequest } from "@/entities/types";
import { supportCategoryService } from "@/features/supportCategory/services/SupportCategoryService";
import { useCrudActions } from "@/shared/hooks/useCrudActions";

type Options = {
    onSuccess?: (result?: SupportCategoryRequest) => void;
    onError?: (error: unknown) => void;
}

export const useSupportCategoryActions = (options?: Options) => {

    const crud = useCrudActions(supportCategoryService, options);

    return {
        saving: crud.saving,
        deleting: crud.deleting,
        error: crud.error,

        addSupportCategory: crud.add,
        editSupportCategory: crud.edit,
        removeSupportCategory: crud.remove,
    }
}