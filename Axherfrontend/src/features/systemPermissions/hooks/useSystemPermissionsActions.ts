"use client";

import { SystemPermissions } from "@/entities/types";
import { systemPermissionsService } from "@/features/systemPermissions/services/SystemPermissionsService";
import { useCrudActions } from "@/shared/hooks/useCrudActions";

type Options = {
    onSuccess?: (result?: SystemPermissions) => void;
    onError?: (error: unknown) => void;
};

export const useSystemPermissionsActions = (options?: Options) => {

    const crud = useCrudActions(systemPermissionsService, options);

    return {
        saving: crud.saving,
        deleting: crud.deleting,
        error: crud.error,

        addSystemPermission: crud.add,
        editSystemPermission: crud.edit,
        removeSystemPermission: crud.remove
    }
   
}