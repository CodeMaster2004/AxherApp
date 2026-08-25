"use client";

import { ContentStatusRequest, ContentStatusResponse } from "@/entities/types";
import { contentStatusService } from "@/features/contentStatus/services/ContentStatusService";
import { useCrudActions } from "@/shared/hooks/useCrudActions";

type Options = {
    onSuccess?: (result?: ContentStatusResponse) => void;
    onError?: (error: unknown) => void;
};

export const useContentStatusActions = (options?: Options) => {

    const crud = useCrudActions(contentStatusService, options);

    return {
        saving: crud.saving,
        deleting: crud.deleting,
        error: crud.error,

        addContentStatus: crud.add,
        editContentStatus: crud.edit,
        removeContentStatus: crud.remove,
    }
   
}