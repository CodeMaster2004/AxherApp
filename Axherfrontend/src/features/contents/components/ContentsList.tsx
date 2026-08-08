"use client";

import { ContentDetail, ContentStatus } from "@/entities/types";
import Pagination from "@/shared/components/ui/Pagination";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import tableStyles from "@/shared/styles/shared/Table.module.css";
import Image from "next/image";
import { useState } from "react";
import ConfirmDialog from "../../../shared/components/ui/ConfirmDialog";
import MoreMenu from "../../../shared/components/ui/MoreMenu";
interface Props{
    contents: ContentDetail[];
    statuses: ContentStatus[];

    onDelete: (id: number) => void;
    onEdit: (content: ContentDetail) => void;
    onUpdateStatus: (id: number, statusId: number) => void;
    
    onView?: (content: ContentDetail) => void;
    onViewSeasons?: (content: ContentDetail) => void;
    onCreateSeason?: (content: ContentDetail) => void;
    deletingId?: number | null;
    loading?: boolean;

    currentPage: number;
    totalPages: number;
    onNextPage: () => void;
    onPrevPage: () => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;
}

export default function ContentsList({
    contents,
    statuses,
    onDelete,
    onEdit,
    onUpdateStatus,
    onView,
    onViewSeasons,
    onCreateSeason,
    deletingId,
    loading,
    currentPage,
    totalPages,
    onNextPage,
    onPrevPage,
    searchTerm,
    onSearchChange,
}: Props){
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

    const formatDate = (dateStr: string): string => {
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
                title="Confirmar Eliminacion"
                message={`¿Estas seguro que deseas eliminar "${confirmDialog.title}"? Esta accion no se puede deshacer.`}
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

            <h2>Listado de Contenidos</h2>

            <div className={tableStyles.searchBox}>
                <input
                    type="text"
                    placeholder="Buscar contenido..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className={tableStyles.searchInput}
                />

            </div>

            {contents.length === 0 ? (
                <p>{loading ? "Buscando..." : "No hay contenidos registrados"}</p>
            ) : (
                <div className={`${tableStyles.tableWrap} ${loading ? tableStyles.loading : ""}`}>

                    <table className={tableStyles.table}>
                        <thead>
                            <tr className={tableStyles.rowHover}>
                                <th className={`${tableStyles.headCell} ${tableStyles.idColum}`}>ID</th>
                                <th className={`${tableStyles.headCell} ${tableStyles.posterColumn}`}>Poster</th>
                                <th className={`${tableStyles.headCell} ${tableStyles.titleColumn}`}>Titulo</th>
                                <th className={`${tableStyles.headCell} ${tableStyles.typeColumn}`}>Tipo</th>
                                <th className={`${tableStyles.headCell} ${tableStyles.priceColumn}`}>Precio</th>
                                <th className={`${tableStyles.headCell} ${tableStyles.categoriesColumn}`}>categorias</th>
                                <th className={`${tableStyles.headCell} ${tableStyles.statusColumn}`}>Estado</th>
                                <th className={`${tableStyles.headCell} ${tableStyles.discountColumn}`}>Descuento</th>
                                <th className={`${tableStyles.headCell} ${tableStyles.registeredAtcolumn}`}>Registrado</th>
                                <th className={tableStyles.actionsColumn}>Acciones</th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            {contents.map((content) => (
                                <tr key={content.contentId}>
                                    <td>{content.contentId}</td>

                                    <td>
                                        {content.posterUrl ? (
                                            <Image 
                                                src={content.posterUrl}
                                                alt={content.title}
                                                width={100}
                                                height={150}
                                                style={{objectFit: "cover"}}
                                            />
                                        ) : (
                                            "-"
                                        )}
                                    </td>

                                    <td>{content.title}</td>

                                    <td>
                                        <span className={content.type === "SERIE" ? tableStyles.badgeSeries : tableStyles.badgeMovie}>
                                            {content.type === "SERIE" ? "Serie" : "Pelicula"}
                                        </span>
                                    </td>

                                    <td>S/ {content.price.toFixed(2)}</td>

                                    <td className={tableStyles.categoriesCell}>{content.categories.join(", ")}</td>
                                    <td>
                                        <select
                                            className={tableStyles.statusSelect}
                                            value={
                                                pendingStatus[content.contentId] ?? content.status.contentStatusId
                                            }
                                            onChange={(e)=>{
                                            const statusId = Number(e.target.value);

                                            const selectedStatus = statuses.find(
                                                status => status.contentStatusId === statusId
                                            );

                                            setPendingStatus(prev => ({
                                                ...prev,
                                                [content.contentId]: statusId
                                            }));

                                            setStatusDialog({
                                                isOpen: true,
                                                contentId: content.contentId,
                                                statusId,
                                                statusName: selectedStatus?.name ?? "",
                                                contentTitle: content.title
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
                                    <td>{content.discountAmount ? `${content.discountAmount}%` : "Sin descuento"}</td>

                                    <td>{formatDate(content.registeredAt)}</td>

                                    <td>
                                        <MoreMenu
                                            items={[
                                                ...(onView && content.type === "SERIE" ? [{
                                                    label: "Ver Serie",
                                                    onClick: () => onView(content),
                                                }] : []),
                                                ...(onViewSeasons && content.type === "SERIE" ? [{
                                                    label: "Ver temporadas",
                                                    onClick: () => onViewSeasons(content),
                                                }] : []),
                                                ...(onCreateSeason && content.type === "SERIE" ? [{
                                                    label: "Crear temporada",
                                                    onClick: () => onCreateSeason(content),
                                                }] : []),
                                                {
                                                    label: "Editar",
                                                    onClick: () => onEdit(content),
                                                },
                                                
                                                {
                                                    label: deletingId === content.contentId ? "Eliminando..." : "Eliminar",
                                                    onClick: () => handleDeleteClick(content.contentId, content.title),
                                                    variant: "danger",
                                                },
                                            ]}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>


                </div>
            )}

            {contents.length > 0 && totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onNextPage={onNextPage}
                    onPrevPage={onPrevPage}
                />
            )}

        </div>
    );
}