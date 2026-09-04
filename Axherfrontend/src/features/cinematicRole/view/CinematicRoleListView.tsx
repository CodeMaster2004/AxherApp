"use client";

import { CinematicRoleResponse } from "@/entities/types";
import CinematicRoleList from "@/features/cinematicRole/components/CinematicRoleList";
import { useCinematicRole } from "@/features/cinematicRole/hooks/useCinematicRole";
import { useCinematicRoleActions } from "@/features/cinematicRole/hooks/useCinematicRoleActions";
import Button from "@/shared/components/ui/Button";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";

export default function CinematicRoleListView() {

    const router = useRouter();

    const common = useTranslations("common");
    const t = useTranslations("cinematicRole");

    const {
        cinematicRoles,
        loading,
        currentPage,
        totalPages,
        nextPage,
        prevPage,
        searchTerm,
        setSearchTerm,
        refetch,
    } = useCinematicRole();

    const {
        deleting,
        removeCinematicRole,
    } = useCinematicRoleActions({
        onSuccess: refetch,
    });

    const handleCreate = () => {
        router.push(
            "/admin/cinematic-roles/create"
        );
    };

    const handleEdit = (
        cinematicRole: CinematicRoleResponse
    ) => {
        router.push(
            `/admin/cinematic-roles/${cinematicRole.cinematicRoleId}/edit`
        );
    };

    const handleTranslations = (
        cinematicRole: CinematicRoleResponse
    ) => {
        router.push(
            `/admin/cinematic-roles/${cinematicRole.cinematicRoleId}/translations`
        );
    };

    return (
        <div
            className={
                layoutStyles.pageContainer
            }
        >

            <div
                className={
                    layoutStyles.header
                }
            >

                <h1>
                    {t("title")}
                </h1>

                <Button
                    variant="animated"
                    onClick={handleCreate}
                >
                    {common("new")}
                </Button>

            </div>

            <CinematicRoleList
                cinematicRoles={cinematicRoles}
                onDelete={removeCinematicRole}
                onEdit={handleEdit}
                deletingId={deleting}
                loading={loading}
                currentPage={currentPage}
                totalPages={totalPages}
                onPrevPage={prevPage}
                onNextPage={nextPage}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onTranslations={handleTranslations}
            />

        </div>
    );
}