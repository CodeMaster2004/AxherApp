import { ContentStatus } from "@/entities/types";
import MoreMenu from "@/shared/components/ui/MoreMenu";
import Pagination from "@/shared/components/ui/Pagination";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import tableStyles from "@/shared/styles/shared/Table.module.css";
import { useState } from "react";
import ConfirmDialog from "../../../shared/components/ui/ConfirmDialog";

interface Props {
    contentStatus: ContentStatus[];
    onDelete: (id: number) => void;
    onEdit: (contentStatus: ContentStatus) => void;
    deletingId?: number | null;
    loading?: boolean;

    currentPage: number;
    totalPages: number;
    onNextPage: () => void;
    onPrevPage: () => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;
}

export default function ContentStatusList ({contentStatus, onDelete, onEdit, deletingId, loading, currentPage, totalPages, onNextPage, onPrevPage, searchTerm, onSearchChange} : Props){

    const [confirmDialog, setConfirmDialog] = useState<{isOpen: boolean; id: number; name: string}>({
        isOpen: false,
        id: 0,
        name: "",
    });

    const handleDeleteClick = (id: number, name: string) => {
        setConfirmDialog({isOpen: true, id, name});
    };

    const handleConfirmDelete = () => {
        onDelete(confirmDialog.id);
        setConfirmDialog({isOpen: false, id: 0, name: ""});
    };

    const handleCancelDelete = () => {
        setConfirmDialog({isOpen: false, id: 0, name: ""});
    };

    return(
        <div className={layoutStyles.section}>

            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title="confirmar Eliminación"
                message={`¿Estás seguro de que deseas eliminar el etado de peliculas "${confirmDialog.name}"? ESta acción no se puede deshacer.`}
                confirmText="Eliminar"
                cancelText="Cancelar"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                variant="danger"
            />

            <h2>Lista de Estado de Peliculas</h2>

            <div className={tableStyles.searchBox}>
                <input
                    type="text"
                    placeholder="Buscar estado de peliculas..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className={tableStyles.searchInput}
                />

            </div>

            {contentStatus.length === 0 ? (
                <p>{loading ? "Buscando..." : "No hay estados de peliculas con ese termino"}</p>

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
                        {contentStatus.map((contentStatus) => (
                            <tr key={contentStatus.contentStatusId} className={tableStyles.rowHover}>
                                <td className={`${tableStyles.cell} ${tableStyles.idColumn}`}>{contentStatus.contentStatusId}</td>
                                <td className={tableStyles.cell}>{contentStatus.code}</td>
                                <td className={tableStyles.cell}>{contentStatus.name}</td>
                                <td className={tableStyles.cell}>{contentStatus.description}</td>
                                    <td className={`${tableStyles.cell} ${tableStyles.actions}`}>
                                            {/* Menú de tres puntos con acciones de fila */}
                                            <MoreMenu
                                                items={[
                                                    {
                                                        label: "Editar",
                                                        onClick: () => onEdit(contentStatus),
                                                    },
                                                    {
                                                        label:
                                                            deletingId === contentStatus.contentStatusId
                                                                ? "Eliminando..."
                                                                : "Eliminar",
                                                        onClick: () => handleDeleteClick(contentStatus.contentStatusId, contentStatus.code),
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
                {contentStatus.length > 0 && totalPages > 1 && (
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