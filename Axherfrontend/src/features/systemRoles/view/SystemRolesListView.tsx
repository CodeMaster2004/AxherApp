"use client";

import {  SystemRoles } from "@/entities/types";
import SystemRolesList from "@/features/systemRoles/components/SystemRolesList";
import { useSystemRoles, useSystemRolesActions } from "@/features/systemRoles/hooks";
import Button from "@/shared/components/ui/Button";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";



export default function SystemRolesListView(){
    const router = useRouter();
    const common = useTranslations("common");
    const t = useTranslations("systemRoles");
    const {
        systemRoles,
        loading,
        currentPage,
        totalPages,
        nextPage,
        prevPage,
        searchTerm,
        setSearchTerm,
        refetch
    } = useSystemRoles();

    const {
        deleting,
        removeSystemRole,
    } = useSystemRolesActions({
        onSuccess: refetch,
    });

    const handleCreate = () => {
        router.push("/admin/systemRoles/create");
    };

    const handleEdit = (systemRoles: SystemRoles) => {
        router.push(`/admin/systemRoles/${systemRoles.systemRoleId}/edit`);
    }

    return(
            <div className={layoutStyles.pageContainer}>
                <div className={layoutStyles.header}>
                    <h1>{t("title")}</h1>
                    <Button variant="animated" onClick={handleCreate}>
                        {common("new")}
                    </Button>

                </div>
                <SystemRolesList
                    systemRoles={systemRoles}
                    onDelete={removeSystemRole}
                    onEdit={handleEdit}
                    deletingId={deleting}
                    loading={loading}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onNextPage={nextPage}
                    onPrevPage={prevPage}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                />

            </div>
    )
}