"use client";

import { useSystemRolesActions } from "@/features/systemRoles/hooks";
import { useRouter } from "next/navigation";
import { SyntheticEvent, useState } from "react";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import SystemRolesForm from "@/features/systemRoles/components/SystemRolesForm";

export default function CreateSystemRolesPage(){
    const router = useRouter();
    
    const [roleName, setRoleName] = useState("");
    
    const {addSystemRole, saving} = useSystemRolesActions({
        onSuccess: () => router.push("/admin/systemRoles"),
    });

    const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        const roleNameTrim = roleName.trim();

        if(!roleNameTrim){
            alert("Por favor completa el campo de nombre del rol");
            return;
        }

        await addSystemRole({
            roleName: roleNameTrim,
        });
    };

    const handleCancel = () => {
        router.push("/admin/systemRoles");
    };

    return (
        <div className={layoutStyles.pageContainer}>
            <h1>Crear Rol del Sistema</h1>

            <SystemRolesForm
                roleName={roleName}
                setRoleName={setRoleName}
                onSubmit={handleSubmit}
                isEditing={false}
                onCancel={handleCancel}
                saving={saving}
            />
        </div>
    )
}