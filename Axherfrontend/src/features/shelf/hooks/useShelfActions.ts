"use client";

import { ContentShelf } from "@/entities/types";
import { useCrudActions } from "@/shared/hooks/useCrudActions";
import { shelfService } from "@/features/shelf/services/shelfService";
import { useCallback, useState } from "react";

type Options = {
    onSuccess?: (result?: ContentShelf) => void;
    onError?: (error: unknown) => void;
};

export const useShelfActions = (options?: Options) => {

    const crud = useCrudActions(shelfService, options);
    const [toggling, setToggling] = useState<number | null>(null);

    const toggleShelf = useCallback(
        async(id:number)=>{
            setToggling(id);
            try{
                const updated = await shelfService.toggleActive(id);
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
        toggling,
        error: crud.error,

        addShelf: crud.add,
        editShelf: crud.edit,
        removeShelf: crud.remove,

        toggleShelf
    }
   
}