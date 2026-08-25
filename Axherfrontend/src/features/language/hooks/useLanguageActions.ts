"use client";

import { LanguageRequest } from "@/entities/types";
import { languageService } from "@/features/language/services/languageService";
import { useCrudActions } from "@/shared/hooks/useCrudActions";

type Options = {
    onSuccess?: (result?: LanguageRequest) => void;
    onError?: (error: unknown) => void;
};

export const useLanguageActions = (options?: Options) => {

    const crud = useCrudActions(languageService, options);

    return {
        saving: crud.saving,
        deleting: crud.deleting,
        error: crud.error,

        addLanguage: crud.add,
        editLanguage: crud.edit,
        removeLanguage: crud.remove,
    };
};