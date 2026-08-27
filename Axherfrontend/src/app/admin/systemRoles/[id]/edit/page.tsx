"use client";

import { SystemRoles } from "@/entities/types";
import SystemRolesForm from "@/features/systemRoles/components/SystemRolesForm";
import { useSystemRolesActions } from "@/features/systemRoles/hooks";
import { systemRolesService } from "@/features/systemRoles/services/SystemRolesService";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { SyntheticEvent, useEffect, useState } from "react";

export default function EditSystemRolesPage(){
    const router = useRouter();
    const params = useParams();
    const id = params?.id ? Number(params.id) : null;
    const [roleName, setRoleName] = useState("");
    const [loading, setLoading] = useState(true);
    const common = useTranslations("common");
    const t = useTranslations("systemRoles");
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
                alert(t("error.loading"));
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
            alert(t("form.validation.roleNameRequired"));
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
        return <div className={layoutStyles.loading}>{common("loading")}...</div>
    }

    return (
        <div className={layoutStyles.pageContainer}>
            <h1>{t("editTitle")}</h1>

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

