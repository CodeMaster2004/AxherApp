"use client";

import { SystemRoles } from "@/entities/types";
import SystemRolesForm from "@/features/systemRoles/components/SystemRolesForm";
import { useSystemRolesActions } from "@/features/systemRoles/hooks";
import { systemRolesService } from "@/features/systemRoles/services/SystemRolesService";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import { useParams, useRouter } from "next/navigation";
import { SyntheticEvent, useEffect, useState } from "react";

export default function EditSystemRolesPage(){
    const router = useRouter();
    const params = useParams();
    const id = params?.id ? Number(params.id) : null;
    const [roleName, setRoleName] = useState("");
    const [loading, setLoading] = useState(true);

    const {editSystemRole, saving} = useSystemRolesActions({
        onSuccess: () => router.push("/admin/systemRoles"),
    });

    useEffect(() => {
        if(!id){
            router.push("/admin/systemRoles");
            return;
        }

        const loadSystemRole = async () => {
            try{
                const role: SystemRoles = await systemRolesService.getById(id);
                setRoleName(role.roleName);
            }catch(error){
                console.error("Error cargando rol del sistema:", error);
                alert("Error al cargar el rol del sistema");
                router.push("/admin/systemRoles");
            }finally{
                setLoading(false);
            }
        };
        loadSystemRole();

    }, [id, router]);

    const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(!id) return;

        const roleNameTrim = roleName.trim();

        if(!roleNameTrim){
            alert("Por favor completa el campo de nombre del rol");
            return;
        }

        await editSystemRole(id, {
            roleName: roleNameTrim,
        });
    };

    const handleCancel = () => {
        router.push("/admin/systemRoles");
    };

    if(loading){
        return <div className={layoutStyles.loading}>Cargando...</div>
    }

    return (
        <div className={layoutStyles.pageContainer}>
            <h1>Editar Rol del Sistema</h1>

            <SystemRolesForm
                roleName={roleName}
                setRoleName={setRoleName}
                onSubmit={handleSubmit}
                isEditing={true}
                onCancel={handleCancel}
                saving={saving}
            />
        </div>
    )

}

