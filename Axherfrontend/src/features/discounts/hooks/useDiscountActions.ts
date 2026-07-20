"use client";

import { Discounts } from "@/entities/types";
import { discountsService } from "@/features/discounts/services/DiscountsService";
import { useCrudActions } from "@/shared/hooks/useCrudActions";

type Options = {
    onSuccess?: (result?: Discounts) => void;
    onError?: (error: unknown) => void;
};

export const useDiscountsActions = (options?: Options) => {

    const crud = useCrudActions(discountsService, options);

    return {
        saving: crud.saving,
        deleting: crud.deleting,
        error: crud.error,

        addDiscounts: crud.add,
        editDiscounts: crud.edit,
        removeDiscounts: crud.remove,
    };
}