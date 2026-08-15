import { ReportStatusResponse } from "@/entities/types";
import { useState } from "react";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import tableStyles from "@/shared/styles/shared/Table.module.css";
import ConfirmDialog from "@/shared/components/ui/ConfirmDialog";
import MoreMenu from "@/shared/components/ui/MoreMenu";
import Pagination from "@/shared/components/ui/Pagination";

interface Props {
    reportStatus: ReportStatusResponse[];
    onDelete: (reportStatusId: number) => void;
    onEdit: (reportStatus: ReportStatusResponse) => void;
    deletingId?: number | null;
    loading?: boolean;

    currentPage: number;
    totalPages: number;
    onNextPage: () => void;
    onPrevPage: () => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;
}

export default function ReportStatusList({
    reportStatus,
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

    const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean, reportStatusId: number, name: string }>({
        isOpen: false,
        reportStatusId: 0,
        name: ""
    });

    const handleDeleteClick = (reportStatusId: number, name: string) => {
        setConfirmDialog({ isOpen: true, reportStatusId, name });
    }

    const handleConfirmDelete = () => {
        onDelete(confirmDialog.reportStatusId);
        setConfirmDialog({ isOpen: false, reportStatusId: 0, name: "" });
    }

    const handleCancelDelete = () => {
        setConfirmDialog({ isOpen: false, reportStatusId: 0, name: "" });
    }

    return (

        <div className={layoutStyles.section}>
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title="Confirmar Eliminación"
                message={`¿Estás seguro de que deseas eliminar el estado de reporte "${confirmDialog.name}"? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                cancelText="Cancelar"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                variant="danger"
            />
            <h2>Lista de Estados de Reporte</h2>

            <div className={tableStyles.searchBox}>
                <input
                    type="text"
                    placeholder="Buscar por nombre o código"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className={tableStyles.searchInput}
                />
            </div>

            {reportStatus.length === 0 ? (
                <p>{loading ? "Cargando..." : "No se encontraron estados de reporte."}</p>
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
                        {reportStatus.map((reportStatus) => (
                            <tr key={reportStatus.reportStatusId} className={tableStyles.rowHover}>
                                <td className={`${tableStyles.cell} ${tableStyles.idColumn}`}>{reportStatus.reportStatusId}</td>
                                <td className={tableStyles.cell}>{reportStatus.code}</td>
                                <td className={tableStyles.cell}>{reportStatus.name}</td>
                                <td className={tableStyles.cell}>{reportStatus.description}</td>
                                    <td className={`${tableStyles.cell} ${tableStyles.actions}`}>
                                            {/* Menú de tres puntos con acciones de fila */}
                                            <MoreMenu
                                                items={[
                                                    {
                                                        label: "Editar",
                                                        onClick: () => onEdit(reportStatus),
                                                    },
                                                    {
                                                        label:
                                                            deletingId === reportStatus.reportStatusId
                                                                ? "Eliminando..."
                                                                : "Eliminar",
                                                        onClick: () => handleDeleteClick(reportStatus.reportStatusId, reportStatus.code),
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
            {reportStatus.length > 0 && totalPages > 1 && (
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