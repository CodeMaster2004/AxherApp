"use client";

import { SystemPermissions } from "@/entities/types";
import SystemPermissionsList from "@/features/systemPermissions/components/SystemPermissionsList";
import { useSystemPermissions, useSystemPermissionsActions } from "@/features/systemPermissions/hooks";
import Button from "@/shared/components/ui/Button";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";



export default function SystemPermissionsListView(){
    const router = useRouter();
    const t = useTranslations("common");
    const {
        systemPermissions,
        loading,
        currentPage,
        totalPages,
        nextPage,
        prevPage,
        goToPage,
        searchTerm,
        setSearchTerm,
        refetch
    } = useSystemPermissions();

    const {
        deleting,
        removeSystemPermission,
    } = useSystemPermissionsActions({
        onSuccess: refetch,
    });

    const handleCreate = () => {
        router.push("/admin/systemPermissions/create");
    }

    const handleEdit = (systemPermissions: SystemPermissions) => {
        router.push(`/admin/systemPermissions/${systemPermissions.systemPermissionId}/edit`);
    }

    return (
        <div className={layoutStyles.pageContainer}>

            <div className={layoutStyles.header}>
                <h1>Permisos del Sistema</h1>
                <Button variant="animated" onClick={handleCreate}>
                    {t("new")}
                </Button>
            </div>
            <SystemPermissionsList
                systemPermissions={systemPermissions}
                onDelete={removeSystemPermission}
                onEdit={handleEdit}
                deletingId={deleting}
                loading={loading}
                currentPage={currentPage}
                totalPages={totalPages}
                onNextPage={nextPage}
                onPrevPage={prevPage}
                onGoToPage={goToPage}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
            />
        </div>
    )
}