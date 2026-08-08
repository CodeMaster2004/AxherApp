"use client";

import { ContentStatus, EpisodeDetail } from "@/entities/types";
import Pagination from "@/shared/components/ui/Pagination";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import tableStyles from "@/shared/styles/shared/Table.module.css";
import { formatDuration } from "@/shared/utils/formatDuration";
import { useState } from "react";
import ConfirmDialog from "../../../shared/components/ui/ConfirmDialog";
import MoreMenu from "../../../shared/components/ui/MoreMenu";

interface Props{
    episodes: EpisodeDetail[];
    statuses: ContentStatus[];
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

    const formatDate = (dateStr?: string): string => {
        if(!dateStr) return '-';
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
    };

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

    return (
        <div className={layoutStyles.section}>
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title="Confirmar eliminación"
                message={`¿Eliminar el episodio "${confirmDialog.title}"? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                cancelText="Cancelar"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                variant="danger"
            />

            <ConfirmDialog
                isOpen={statusDialog.isOpen}
                title="Cambiar estado"
                message={
                    `¿Seguro que deseas cambiar "${statusDialog.contentTitle}" a "${statusDialog.statusName}"?`
                }
                confirmText="Cambiar"
                cancelText="Cancelar"
                onConfirm={handleConfirmStatus}
                onCancel={handleCancelStatus}
                variant="info"
            />

            <h2>Listado de Episodios</h2>

            <div className={tableStyles.searchBox}>
                <input
                    type="text"
                    placeholder="Buscar episodio..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className={tableStyles.searchInput}
                />
            </div>
            {episodes.length === 0 ? (
                <p>{loading ? "Buscando..." : "No hay episodios registrados"}</p>
            ) : (
                <div className={`${tableStyles.tableWrap} ${loading ? tableStyles.loading : ""}`}>
                    <table className={tableStyles.table}>
                        <thead>
                            <tr className={tableStyles.rowHover}>
                                <th className={tableStyles.headCell}>ID</th>
                                <th className={tableStyles.headCell}>N° Episodio</th>
                                <th className={tableStyles.headCell}>Titulo</th>
                                <th className={tableStyles.headCell}>Duración</th>
                                <th className={tableStyles.headCell}>Fecha estreno</th>
                                <th className={tableStyles.headCell}>Estado</th>
                                <th className={tableStyles.headCell}>Video</th>
                                <th className={tableStyles.headCell}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {episodes.map((episode) => (
                                <tr key={episode.episodeId}>
                                    <th>{episode.episodeId}</th>
                                    <td>{episode.episodeNumber}</td>
                                    <td>{episode.title}</td>
                                    <td>{episode.durationSeconds ? formatDuration(episode.durationSeconds) : "-"}</td>
                                    <td>{formatDate(episode.releaseDate)}</td>

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
                                                Ver episodio
                                            </a>
                                        ) : (
                                            "-"
                                        )}
                                    </td>
                                    <td>
                                        <MoreMenu
                                            items={[
                                                {
                                                    label: "Editar",
                                                    onClick: () => onEdit(episode),
                                                },
                                                {
                                                    label:
                                                        deletingId === episode.episodeId
                                                            ? "Eliminando..."
                                                            : "Eliminar",
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