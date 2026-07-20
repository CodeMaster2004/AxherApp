"use client";

import { SeasonDetail } from "@/entities/types";
import Pagination from "@/shared/components/ui/Pagination";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import tableStyles from "@/shared/styles/shared/Table.module.css";
import { useState } from "react";
import ConfirmDialog from "../../../shared/components/ui/ConfirmDialog";
import MoreMenu from "../../../shared/components/ui/MoreMenu";

interface Props{
    seasons: SeasonDetail[];
    onDelete: (seasonId: number) => void;
    onEdit: (season: SeasonDetail) => void;
    onViewEpisodes: (seasonId: number) => void;
    onCreateEpisode: (seasonId: number) => void;
    deletingId?: number | null;
    loading?: boolean;

    currentPage: number;
    totalPages: number;
    onNextPage: () => void;
    onPrevPage: () => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;
}

export default function SeasonsList({
    seasons,
    onDelete,
    onEdit,
    onViewEpisodes,
    onCreateEpisode,
    deletingId,
    loading,
    currentPage,
    totalPages,
    onNextPage,
    onPrevPage,
    searchTerm,
    onSearchChange,
}: Props){
    const [confirmDialog, setConfimDialog] = useState<{
        isOpen: boolean;
        id: number;
        title: string;
    }>({
        isOpen: false,
        id: 0,
        title: "",
    });

    const formatDate = (dateStr: string): string => {
        if(!dateStr) return '-';
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
    };

    const handleDeleteClick = (id: number, title: string) => {
        setConfimDialog({ isOpen: true, id, title});
    };

    const handleConfirmDelete = () => {
        onDelete(confirmDialog.id);
        setConfimDialog({ isOpen: false, id: 0, title: ""});
    };

    const handleCancelDelete = () => {
        setConfimDialog({ isOpen: false, id: 0, title: ""});
    };

    return (
        <div className={layoutStyles.section}>
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title="Confirmar Eliminacion"
                message={`¿Eliminar la temporada "${confirmDialog.title}"? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                cancelText="Cancelar"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                variant="danger"

            />

            <h2>Listado de Temporadas  </h2>

            <div className={tableStyles.searchBox}>
                <input
                    type="text"
                    placeholder="Buscar temporadas..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className={tableStyles.searchInput}
                />

            </div>

            {seasons.length === 0 ? (
                <p>{loading ? "Buscando..." : "No hay temporadas registradas"}</p>
            ) : (
                <div className={`${tableStyles.tableWrap} ${loading ? tableStyles.loadig : ""}`}>
                    <table className={tableStyles.table}>
                        <thead>
                            <tr className={tableStyles.rowHover}>
                                <th className={tableStyles.headCell}>ID</th>
                                <th className={tableStyles.headCell}>N° Temporadas</th>
                                <th className={tableStyles.headCell}>Titulo</th>
                                <th className={tableStyles.headCell}>Descripción</th>
                                <th className={tableStyles.headCell}>Fecha estreno</th>
                                <th className={tableStyles.headCell}>Episodios</th>
                                <th className={tableStyles.headCell}>Acciones</th>

                            </tr>
                        </thead>
                        <tbody>
                            {seasons.map((season) => (
                                <tr key={season.seasonId}>
                                    <td>{season.seasonId}</td>
                                    <td>{season.seasonNumber}</td>
                                    <td>{season.title}</td>
                                    <td>{season.description || "-"}</td>
                                    <td>{formatDate(season.releaseDate)}</td>
                                    <td>{season.episodes.length}</td>
                                    <td>
                                        <MoreMenu
                                            items={[
                                                {
                                                    label: "Ver episodios",
                                                    onClick: () => onViewEpisodes(season.seasonId),
                                                },
                                                {
                                                    label: "Crear episodio",
                                                    onClick: () => onCreateEpisode(season.seasonId),
                                                },
                                                {
                                                    label: "Editar",
                                                    onClick: () => onEdit(season),
                                                },
                                                {
                                                    label:
                                                        deletingId === season.seasonId
                                                            ? "Eliminando..."
                                                            : "Eliminar",
                                                        onClick: () =>
                                                            handleDeleteClick(season.seasonId, season.title),
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
            {seasons.length > 0 && totalPages > 1 && (
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