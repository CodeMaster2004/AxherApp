"use client";

import { ContentDetail, ContentType } from "@/entities/types";
import { useCinematicRole } from "@/features/cinematicRole/hooks/useCinematicRole";
import ContentsList from "@/features/contents/components/ContentsList";
import { useContents, useContentsActions } from "@/features/contents/hooks";
import { useContentStatus } from "@/features/contentStatus/hooks";
import ContentPersonRolesPanel from "@/features/people/components/ContentPersonRolesPanel";
import { usePerson } from "@/features/people/hooks/usePerson";
import Button from "@/shared/components/ui/Button";
import Modal from "@/shared/components/ui/Modal";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ContentsListView() {
    const router = useRouter();

    const [type, setType] = useState<"ALL" | ContentType>("ALL");
    const [managingPeopleContent, setManagingPeopleContent] = useState<ContentDetail | null>(null);
    const {
        contents,
        loading,
        currentPage,
        totalPages,
        nextPage,
        prevPage,
        searchTerm,
        setSearchTerm,
        refetch,
        setType: setContentType,
    } = useContents();

    const {
        deleting,
        removeContent,
        updateContentStatus,
    } = useContentsActions({
        onSuccess: refetch,
    });

    const { contentStatus } = useContentStatus();

    const { people } = usePerson();

    const { cinematicRoles } = useCinematicRole();

    const handleTypeChange = (value: "ALL" | ContentType) => {
        setType(value);

        setContentType(
            value === "ALL"
                ? undefined
                : value
        );
    };

    const handleCreate = () => {
        router.push("/admin/contents/create");
    };

    const handleEdit = (content: ContentDetail) => {
        router.push(
            `/admin/contents/${content.contentId}/edit`
        );
    };

    const handleTranslations = (content: ContentDetail) => {
        router.push(
            `/admin/contents/${content.contentId}/translations`
        );
    };

    const handleViewSeasons = (content: ContentDetail) => {
        router.push(
            `/admin/series/${content.contentId}/seasons`
        );
    };

    const handleCreateSeason = (content: ContentDetail) => {
        router.push(
            `/admin/series/${content.contentId}/seasons/create`
        );
    };

    const handleManagePeople = (
        content: ContentDetail
    ) => {
        setManagingPeopleContent(content);
    };

    const handleClosePeople = () => {
        setManagingPeopleContent(null);
    };

    const t = useTranslations("contents");
    const common = useTranslations("common");

    return (
        <div className={layoutStyles.pageContainer}>

            <div className={layoutStyles.pageSections}>
                <Button
                    variant="tab"
                    active={type === "ALL"}
                    onClick={() => handleTypeChange("ALL")}
                >
                    {t("filters.all")}
                </Button>

                <Button
                    variant="tab"
                    active={type === ContentType.MOVIE}
                    onClick={() =>
                        handleTypeChange(ContentType.MOVIE)
                    }
                >
                    {t("filters.movies")}
                </Button>

                <Button
                    variant="tab"
                    active={type === ContentType.SERIE}
                    onClick={() =>
                        handleTypeChange(ContentType.SERIE)
                    }
                >
                    {t("filters.series")}
                </Button>
            </div>

            <div className={layoutStyles.header}>
                <h1>{t("title")}</h1>

                <Button
                    variant="animated"
                    onClick={handleCreate}
                >
                    {common("create")}
                </Button>
            </div>

            <ContentsList
                contents={contents}
                statuses={contentStatus}

                onUpdateStatus={(id, statusId) => {
                    updateContentStatus(id, { statusId });
                }}

                onDelete={removeContent}
                onEdit={handleEdit}

                onViewSeasons={handleViewSeasons}
                onCreateSeason={handleCreateSeason}

                deletingId={deleting}
                loading={loading}

                currentPage={currentPage}
                totalPages={totalPages}
                onNextPage={nextPage}
                onPrevPage={prevPage}

                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}

                onTranslations={handleTranslations}
                onManagePeople={handleManagePeople}
            />

            {managingPeopleContent && (
                <Modal
                    open={true}
                    title={t("actions.managePeople")}
                    onClose={handleClosePeople}
                >
                    <ContentPersonRolesPanel
                        contentId={managingPeopleContent.contentId}
                        persons={people}
                        cinematicRoles={cinematicRoles}
                    />

                </Modal>
            )}
        </div>
    );
}