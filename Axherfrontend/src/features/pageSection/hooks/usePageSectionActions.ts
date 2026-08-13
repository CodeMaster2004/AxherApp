"use client";

import { PageSection } from "@/entities/types/pageSection.types";
import { useCrudActions } from "@/shared/hooks/useCrudActions";
import { pageSectionService } from "@/features/pageSection/services/pageSectionService";
import { useCallback, useState } from "react";

type Options = {
    onSuccess?: (result?: PageSection) => void;
    onError?: (error: unknown) => void;
};

export const usePageSectionActions = (
    options?: Options
) => {
    const [toggling, setToggling] =
    useState<number | null>(null);

    const crud = useCrudActions(
        pageSectionService,
        options
    );
    

    const [moving, setMoving] = useState<number | null>(null);
    
    const moveSection = useCallback(
        async (
            id: number,
            displayOrder: number
        ) => {

            setMoving(id);

            try {

                const updated =
                    await pageSectionService.update(
                        id,
                        {
                            displayOrder
                        }
                    );

                options?.onSuccess?.(updated);

                return updated;

            } catch (error) {

                options?.onError?.(error);

                throw error;

            } finally {

                setMoving(null);

            }
        },
        [options]
    );

    const toggleSection = useCallback(
            async(id:number)=>{
                setToggling(id);
                try{
                    const updated = await pageSectionService.toggleActive(id);
                    options?.onSuccess?.(updated);
                    return updated;
                }catch(err){
                    options?.onError?.(err);
                    throw err;
                }finally{
                    setToggling(null);
                }
            },
            [options]
        );
    return {

        saving: crud.saving,
        deleting: crud.deleting,
        moving,
        toggling,

        error: crud.error,

        addSection: crud.add,
        editSection: crud.edit,
        removeSection: crud.remove,

        moveSection,
        toggleSection,
    };
};