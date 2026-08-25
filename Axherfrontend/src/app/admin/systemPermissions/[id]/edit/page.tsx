"use client";

import { systemPermissionsService } from "@/features/systemPermissions/services/SystemPermissionsService";
import { useParams, useRouter } from "next/navigation";
import { SyntheticEvent, useEffect, useState } from "react";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import { useSystemPermissionsActions } from "@/features/systemPermissions/hooks";
import SystemPermissionsForm from "@/features/systemPermissions/components/SystemPermissionsForm";
import { useTranslations } from "next-intl";

export default function EditSystemPermissionsPage() {

    const router = useRouter();
    const params = useParams();
    const id = params?.id ? Number(params.id) : null;
    const [moduleName, setModuleName] = useState("");
    const [actionName, setActionName] = useState("");
    const [permissionName, setPermissionName] = useState("");
    const [loading, setLoading] = useState(true);
    const t = useTranslations("common");
    const {editSystemPermission, saving} = useSystemPermissionsActions({
        onSuccess: () => router.push("/admin/systemPermissions"),
    });

    useEffect(() => {
        if(!id){
            router.push("/admin/systemPermissions");
            return;
        }

        const loadSystemPermission = async () => {
            try{
                const res = await systemPermissionsService.getById(id);
                setModuleName(res.moduleName);
                setActionName(res.actionName);
                setPermissionName(res.permissionName);

            }catch(error){
                console.error("Error cargando permiso del sistema:", error);
                alert("Error al cargar el permiso del sistema");
                router.push("/admin/systemPermissions");
            }finally{
                setLoading(false);
            }
        }; loadSystemPermission();
    }, [id, router]);

    const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(!id) return;

        const moduleNameTrim = moduleName.trim();
        const actionNameTrim = actionName.trim();
        const permissionNameTrim = permissionName.trim();

        if(!moduleNameTrim || !actionNameTrim || !permissionNameTrim){
            alert("Por favor completa todos los campos");
            return;
        }
        
        await editSystemPermission(id, {
            moduleName: moduleNameTrim,
            actionName: actionNameTrim,
            permissionName: permissionNameTrim,
        });
    };

    const handleCancel = () => {
        router.push("/admin/systemPermissions");
    }

    if(loading){
        return <div className={layoutStyles.loading}>{t("loading")}...</div>
    }

    return (
        <div className={layoutStyles.pageContainer}>
            <h1>Editar Permiso del Sistema</h1>

            <SystemPermissionsForm
                moduleName={moduleName}
                setModuleName={setModuleName}
                actionName={actionName}
                setActionName={setActionName}
                permissionName={permissionName}
                setPermissionName={setPermissionName}
                onSubmit={handleSubmit}
                isEditing={true}
                onCancel={handleCancel}
                saving={saving}
            />
        </div>
    )
}