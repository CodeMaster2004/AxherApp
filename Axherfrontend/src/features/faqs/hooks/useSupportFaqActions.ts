"use client";

import { SupportFaqResponse } from "@/entities/types/supportFaq.types";
import { adminSupportFaqService } from "@/features/faqs/services/adminSupportFaqService";
import { supportFaqService } from "@/features/faqs/services/supportFaqService";
import { useCrudActions } from "@/shared/hooks/useCrudActions";
import { useCallback, useState } from "react";

type Options = {
    onSuccess?: (result?: SupportFaqResponse) => void;
    onError?: (error: unknown) => void;
}

export const useSupportFaqActions = (options?: Options) => {

    const crud = useCrudActions(adminSupportFaqService, options);
    const [toggling, setToggling] = useState<number | null>(null);
    const [moving, setMoving] = useState<number | null>(null);

    const toggleActive = useCallback(
        async(id: number) => {
            setToggling(id);

            try {
                const updated = await adminSupportFaqService.toggleActive(id);
                options?.onSuccess?.(updated);
                return updated;
            }catch(error) {
                options?.onError?.(error);
                throw error;
            }finally {
                setToggling(null);
            }
        },
        [options]
    );

    const moveFaq = useCallback(
        async(id: number, displayOrder: number) => {

            setMoving(id);

            try {
                const updated = await adminSupportFaqService.update(id, { displayOrder });
                options?.onSuccess?.(updated);
                return updated;
            }catch(error) {
                options?.onError?.(error);
                throw error;
            }finally {
                setMoving(null);
            }
        },[options]
    );

    return {
        saving: crud.saving,
        deleting: crud.deleting,
        toggling,
        moving,

        error: crud.error,
        
        addFaq: crud.add,
        editFaq: crud.edit,
        removeFaq: crud.remove,

        moveFaq,
        toggleActive,
    }
}
