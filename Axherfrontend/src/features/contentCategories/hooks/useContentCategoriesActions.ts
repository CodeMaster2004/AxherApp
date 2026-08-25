"use client";

import { useCrudActions } from "@/shared/hooks/useCrudActions";
import { contentCategoriesService } from "../services/ContentCategoriesService";
import { ContentCategoryResponse } from "@/entities/types";

type Options = {
    onSuccess?: (result?: ContentCategoryResponse) => void;
    onError?: (error: unknown) => void;
};

export const useContentCategoriesActions = (options?: Options) => {
    const crud = useCrudActions(contentCategoriesService, options);

    return {
        saving: crud.saving,
        deleting: crud.deleting,
        error: crud.error,

        addContentCategory: crud.add,
        editContentCategory: crud.edit,
        removeContentCategory: crud.remove,
    };
};