"use client";

import { CinematicRoleResponse } from "@/entities/types";
import { cinematicRoleService } from "@/features/cinematicRole/services/cinematicRoleService";
import { useCrudActions } from "@/shared/hooks/useCrudActions";

type Options = {
    onSuccess?: (result?: CinematicRoleResponse) => void;
    onError?: (error: unknown) => void;
};

export const useCinematicRoleActions = (
    options?: Options
) => {

    const crud = useCrudActions(
        cinematicRoleService,
        options
    );

    return {
        saving: crud.saving,
        deleting: crud.deleting,
        error: crud.error,

        addCinematicRole: crud.add,
        editCinematicRole: crud.edit,
        removeCinematicRole: crud.remove,
    };
};