"use client";

import { SupportTicketStatusResponse } from "@/entities/types";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import tableStyles from "@/shared/styles/shared/Table.module.css";
import ConfirmDialog from "@/shared/components/ui/ConfirmDialog";
import MoreMenu from "@/shared/components/ui/MoreMenu";
import Pagination from "@/shared/components/ui/Pagination";
import { useState } from "react";

interface Props {
    supportTicketStatus: SupportTicketStatusResponse[];
    onDelete: (supportTicketStatusId: number) => void;
    onEdit: (supportTicketStatus: SupportTicketStatusResponse) => void;
    deletingId?: number | null;
    loading?: boolean;

    currentPage: number;
    totalPages: number;
    onNextPage: () => void;
    onPrevPage: () => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;
}

export default function SupportTicketStatusList({
    supportTicketStatus,
    onDelete,
    onEdit,
    deletingId,
    loading,

    currentPage,
    totalPages,
    onNextPage,
    onPrevPage,
    searchTerm,
    onSearchChange
}: Props) {

    const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean, supportTicketStatusId: number, name: string }>({
        isOpen: false,
        supportTicketStatusId: 0,
        name: ""
    });

    const handleDeleteClick = (supportTicketStatusId: number, name: string) => {
        setConfirmDialog({ isOpen: true, supportTicketStatusId, name });
    }

    const handleConfirmDelete = () => {
        onDelete(confirmDialog.supportTicketStatusId);
        setConfirmDialog({ isOpen: false, supportTicketStatusId: 0, name: "" });
    }

    const handleCancelDelete = () => {
        setConfirmDialog({ isOpen: false, supportTicketStatusId: 0, name: "" });
    }

    return (

        <div className={layoutStyles.section}>
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title="Confirmar Eliminación"
                message={`¿Estás seguro de que deseas eliminar el estado del ticket de soporte "${confirmDialog.name}"? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                cancelText="Cancelar"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                variant="danger"
            />
            <h2>Lista de Estados de Ticket de Soporte</h2>

            <div className={tableStyles.searchBox}>
                <input
                    type="text"
                    placeholder="Buscar por nombre o código"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className={tableStyles.searchInput}
                />
            </div>

            {supportTicketStatus.length === 0 ? (
                <p>{loading ? "Cargando..." : "No se encontraron estados de ticket de soporte."}</p>
            ) : (
                <div className={`${tableStyles.tableWrap} ${loading ? tableStyles.loading : ""}`}>
                  <table className={tableStyles.table}>
                    <thead>
                        <tr className={tableStyles.rowHover}>
                            <th className={`${tableStyles.headCell} ${tableStyles.idColumn}`}>ID</th>
                            <th className={tableStyles.headCell}>Code</th>
                            <th className={tableStyles.headCell}>Nombre</th>
                            <th className={tableStyles.headCell}>Descripción</th>
                            <th className={tableStyles.headCell}>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {supportTicketStatus.map((supportTicketStatus) => (
                            <tr key={supportTicketStatus.supportTicketStatusId} className={tableStyles.rowHover}>
                                <td className={`${tableStyles.cell} ${tableStyles.idColumn}`}>{supportTicketStatus.supportTicketStatusId}</td>
                                <td className={tableStyles.cell}>{supportTicketStatus.code}</td>
                                <td className={tableStyles.cell}>{supportTicketStatus.name}</td>
                                <td className={tableStyles.cell}>{supportTicketStatus.description}</td>
                                    <td className={`${tableStyles.cell} ${tableStyles.actions}`}>
                                            {/* Menú de tres puntos con acciones de fila */}
                                            <MoreMenu
                                                items={[
                                                    {
                                                        label: "Editar",
                                                        onClick: () => onEdit(supportTicketStatus),
                                                    },
                                                    {
                                                        label:
                                                            deletingId === supportTicketStatus.supportTicketStatusId
                                                                ? "Eliminando..."
                                                                : "Eliminar",
                                                        onClick: () => handleDeleteClick(supportTicketStatus.supportTicketStatusId, supportTicketStatus.code),
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
            {supportTicketStatus.length > 0 && totalPages > 1 && (
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