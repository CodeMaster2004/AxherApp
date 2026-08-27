"use client";

import { useSystemRolesActions } from "@/features/systemRoles/hooks";
import { useRouter } from "next/navigation";
import { SyntheticEvent, useState } from "react";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import SystemRolesForm from "@/features/systemRoles/components/SystemRolesForm";
import { useTranslations } from "next-intl";

export default function CreateSystemRolesPage(){
    const router = useRouter();
    const t = useTranslations("systemRoles");
    const [roleName, setRoleName] = useState("");
    
    const {addSystemRole, saving} = useSystemRolesActions({
        onSuccess: () => router.push("/admin/systemRoles"),
    });

    const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        const roleNameTrim = roleName.trim();

        if(!roleNameTrim){
            alert(t("form.validation.roleNameRequired"));
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
            <h1>{t("create.title")}</h1>

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