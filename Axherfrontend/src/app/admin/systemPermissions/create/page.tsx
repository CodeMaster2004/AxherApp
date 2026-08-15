"use client";

import { useRouter } from "next/navigation";
import { SyntheticEvent, useState } from "react";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import SystemPermissionsForm from "@/features/systemPermissions/components/SystemPermissionsForm";
import { useSystemPermissionsActions } from "@/features/systemPermissions/hooks";

export default function CreateSystemPermissionsPage() {
    const router = useRouter();

    const [ModuleName, setModuleName] = useState("");
    const [ActionName, setActionName] = useState("");
    const [PermissionName, setPermissionName] = useState("");
    const {addSystemPermission, saving} = useSystemPermissionsActions({
        onSuccess: () => router.push("/admin/systemPermissions"),
    })

    const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        const moduleNameTrim = ModuleName.trim();
        const actionNameTrim = ActionName.trim();
        const permissionNameTrim = PermissionName.trim();

        if(!moduleNameTrim || !actionNameTrim || !permissionNameTrim){
            alert("Por favor completa todos los campos");
            return;
        }

        await addSystemPermission({
            moduleName: moduleNameTrim,
            actionName: actionNameTrim,
            permissionName: permissionNameTrim,
        });
    };

    return (
        <div className={layoutStyles.pageContainer}>

            <SystemPermissionsForm
                moduleName={ModuleName}
                setModuleName={setModuleName}
                actionName={ActionName}
                setActionName={setActionName}
                permissionName={PermissionName}
                setPermissionName={setPermissionName}
                onSubmit={handleSubmit}
                isEditing={false}
                saving={saving}
            />
        </div>
    )
        
    
}