"use client";

import { ContentStatusResponse, EpisodeDetail } from "@/entities/types";
import Pagination from "@/shared/components/ui/Pagination";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import tableStyles from "@/shared/styles/shared/Table.module.css";
import { formatDuration } from "@/shared/utils/formatDuration";
import { useState } from "react";
import ConfirmDialog from "../../../shared/components/ui/ConfirmDialog";
import MoreMenu from "../../../shared/components/ui/MoreMenu";
import { useLocale, useTranslations } from "next-intl";
import { formatDate } from "@/shared/utils/date";

interface Props{
    episodes: EpisodeDetail[];
    statuses: ContentStatusResponse[];
    onDelete: (episodeId: number) => void;
    onEdit: (episode: EpisodeDetail) => void;
    onUpdateStatus: (id: number, statusId: number) => void;
    deletingId?: number | null;
    loading?: boolean;

    currentPage: number;
    totalPages: number;
    onNextPage: () => void;
    onPrevPage: () => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;
    onTranslations?: (episode: EpisodeDetail) => void;
}

export default function EpisodesList({
    episodes,
    statuses,
    onDelete,
    onEdit,
    onUpdateStatus,
    deletingId,
    loading,
    currentPage,
    totalPages,
    onNextPage,
    onPrevPage,
    searchTerm,
    onSearchChange,
    onTranslations
} : Props) {
     const [pendingStatus, setPendingStatus] = useState<Record<number,number>>({});

    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        id: number;
        title: string;
    }>({
        isOpen: false,
        id: 0,
        title: "",
    });

    const [statusDialog, setStatusDialog] = useState<{
        isOpen: boolean;
        contentId: number;
        statusId: number;
        statusName: string;
        contentTitle: string;
    }>({
        isOpen: false,
        contentId: 0,
        statusId: 0,
        statusName: "",
        contentTitle: "",
    });

    const locale = useLocale();

    const handleDeleteClick = (id: number, title: string) => {
        setConfirmDialog({ isOpen: true, id, title});
    };

    const handleConfirmDelete = () => {
        onDelete(confirmDialog.id);
        setConfirmDialog({ isOpen: false, id: 0, title: ""});
    };

    const handleCancelDelete = () => {
        setConfirmDialog({ isOpen: false, id: 0, title: ""});
    };

    const handleConfirmStatus = () => {

        onUpdateStatus(
            statusDialog.contentId,
            statusDialog.statusId
        );

        setPendingStatus(prev => {
            const copy = {...prev};
            delete copy[statusDialog.contentId];
            return copy;
        });

        handleCancelStatus();
    };


    const handleCancelStatus = () => {

        setPendingStatus(prev => {
            const copy = {...prev};
            delete copy[statusDialog.contentId];
            return copy;
        });

        setStatusDialog({
            isOpen:false,
            contentId:0,
            statusId:0,
            statusName:"",
            contentTitle:""
        });
    };

    const common = useTranslations("common");
    const t = useTranslations("episodes");

    return (
        <div className={layoutStyles.section}>
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title={t("delete.title")}
                message={t("delete.message", { title: confirmDialog.title })}
                confirmText={common("delete")}
                cancelText={common("cancel")}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                variant="danger"
            />

            <ConfirmDialog
                isOpen={statusDialog.isOpen}
                title={t("status.changeTitle")}
                message={t("status.changeMessage", { title: statusDialog.contentTitle, status: statusDialog.statusName })}
                confirmText={common("confirm")}
                cancelText={common("cancel")}
                onConfirm={handleConfirmStatus}
                onCancel={handleCancelStatus}
                variant="info"
            />

            <div className={tableStyles.searchBox}>
                <input
                    type="text"
                    placeholder={t("list.searchPlaceholder")}
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className={tableStyles.searchInput}
                />
            </div>
            {episodes.length === 0 ? (
                <p>{loading ? common("searching") : t("list.empty")}</p>
            ) : (
                <div className={`${tableStyles.tableWrap} ${loading ? tableStyles.loading : ""}`}>
                    <table className={tableStyles.table}>
                        <thead>
                            <tr className={tableStyles.rowHover}>
                                <th className={tableStyles.headCell}>{common("id")}</th>
                                <th className={tableStyles.headCell}>{t("list.episodeNumber")}</th>
                                <th className={tableStyles.headCell}>{common("title")}</th>
                                <th className={tableStyles.headCell}>{t("list.duration")}</th>
                                <th className={tableStyles.headCell}>{t("list.releaseDate")}</th>
                                <th className={tableStyles.headCell}>{t("list.status")}</th>
                                <th className={tableStyles.headCell}>{t("list.video")}</th>
                                <th className={tableStyles.headCell}>{common("actions")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {episodes.map((episode) => (
                                <tr key={episode.episodeId}>
                                    <th>{episode.episodeId}</th>
                                    <td>{episode.episodeNumber}</td>
                                    <td>{episode.title}</td>
                                    <td>{episode.durationSeconds ? formatDuration(episode.durationSeconds) : "-"}</td>
                                    <td>{formatDate(episode.releaseDate, locale)}</td>

                                    <td>
                                        <select
                                            className={tableStyles.statusSelect}
                                            value={
                                                pendingStatus[episode.episodeId] ?? episode.status.contentStatusId
                                            }
                                            onChange={(e)=>{
                                            const statusId = Number(e.target.value);

                                            const selectedStatus = statuses.find(
                                                status => status.contentStatusId === statusId
                                            );

                                            setPendingStatus(prev => ({
                                                ...prev,
                                                [episode.episodeId]: statusId
                                            }));

                                            setStatusDialog({
                                                isOpen: true,
                                                contentId: episode.episodeId,
                                                statusId,
                                                statusName: selectedStatus?.name ?? "",
                                                contentTitle: episode.title
                                            });
                                        }}
                                        >
                                            {
                                                statuses.map((status)=>(
                                                    <option
                                                        key={status.contentStatusId}
                                                        value={status.contentStatusId}
                                                    >
                                                        {status.name}
                                                    </option>
                                                ))
                                            }
                                        </select>
                                    </td>

                                    <td>
                                        {episode.episodeUrl ? (
                                            <a href={episode.episodeUrl} target="_blank" rel="noopener noreferrer">
                                                {t("list.viewEpisode")}
                                            </a>
                                        ) : (
                                            "-"
                                        )}
                                    </td>
                                    <td>
                                        <MoreMenu
                                            items={[
                                                {
                                                    label: common("edit"),
                                                    onClick: () => onEdit(episode),
                                                },
                                                ...(onTranslations ? [{
                                                    label: t("actions.translations"),
                                                    onClick: () => onTranslations(episode),
                                                }]: []),
                                                {
                                                    label:
                                                        deletingId === episode.episodeId
                                                            ? common("deleting")
                                                            : common("delete"),
                                                        onClick: () =>
                                                            handleDeleteClick(episode.episodeId, episode.title),
                                                        variant: "danger",
                                                }
                                            ]}
                                        />
                                    </td>

                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
            )}
            {episodes.length > 0 && totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onNextPage={onNextPage}
                    onPrevPage={onPrevPage}
                />
            )}

        </div>
    )
}