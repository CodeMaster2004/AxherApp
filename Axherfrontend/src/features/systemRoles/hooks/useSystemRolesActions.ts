"use client";

import { SystemRoles } from "@/entities/types";
import { systemRolesService } from "@/features/systemRoles/services/SystemRolesService";
import { useCrudActions } from "@/shared/hooks/useCrudActions";

type Options = {
    onSuccess?: (result?: SystemRoles) => void;
    onError?: (error: unknown) => void;
};

export const useSystemRolesActions = (options?: Options) => {

    const crud = useCrudActions(systemRolesService, options);

    return {
        saving: crud.saving,
        deleting: crud.deleting,
        error: crud.error,

        addSystemRole: crud.add,
        editSystemRole: crud.edit,
        removeSystemRole: crud.remove
    }
}