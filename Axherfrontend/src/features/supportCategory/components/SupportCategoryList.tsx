import { SupportCategoryResponse } from "@/entities/types";
import { useState } from "react";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import tableStyles from "@/shared/styles/shared/Table.module.css";
import ConfirmDialog from "@/shared/components/ui/ConfirmDialog";
import MoreMenu from "@/shared/components/ui/MoreMenu";
import Pagination from "@/shared/components/ui/Pagination";

interface Props {
    supportCategories: SupportCategoryResponse[];
    onDelete: (supportCategoryId: number) => void;
    onEdit: (supportCategory: SupportCategoryResponse) => void;
    deletingId?: number | null;
    loading?: boolean;

    currentPage: number;
    totalPages: number;
    onNextPage: () => void;
    onPrevPage: () => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;
}

export default function SupportCategoryList({
    supportCategories,
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

    const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean, supportCategoryId: number, name: string }>({
            isOpen: false,
            supportCategoryId: 0,
            name: ""
        });
    
        const handleDeleteClick = (supportCategoryId: number, name: string) => {
            setConfirmDialog({ isOpen: true, supportCategoryId, name });
        }
    
        const handleConfirmDelete = () => {
            onDelete(confirmDialog.supportCategoryId);
            setConfirmDialog({ isOpen: false, supportCategoryId: 0, name: "" });
        }
    
        const handleCancelDelete = () => {
            setConfirmDialog({ isOpen: false, supportCategoryId: 0, name: "" });
        }

        return (

        <div className={layoutStyles.section}>
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title="Confirmar Eliminación"
                message={`¿Estás seguro de que deseas eliminar la categoria de soporte "${confirmDialog.name}"? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                cancelText="Cancelar"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                variant="danger"
            />
            <h2>Lista de Categorias de Soporte</h2>

            <div className={tableStyles.searchBox}>
                <input
                    type="text"
                    placeholder="Buscar por nombre o código"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className={tableStyles.searchInput}
                />
            </div>

            {supportCategories.length === 0 ? (
                <p>{loading ? "Cargando..." : "No se encontraron categorias de soporte."}</p>
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
                        {supportCategories.map((supportCategory) => (
                            <tr key={supportCategory.supportCategoryId} className={tableStyles.rowHover}>
                                <td className={`${tableStyles.cell} ${tableStyles.idColumn}`}>{supportCategory.supportCategoryId}</td>
                                <td className={tableStyles.cell}>{supportCategory.code}</td>
                                <td className={tableStyles.cell}>{supportCategory.name}</td>
                                <td className={tableStyles.cell}>{supportCategory.description}</td>
                                    <td className={`${tableStyles.cell} ${tableStyles.actions}`}>
                                            {/* Menú de tres puntos con acciones de fila */}
                                            <MoreMenu
                                                items={[
                                                    {
                                                        label: "Editar",
                                                        onClick: () => onEdit(supportCategory),
                                                    },
                                                    {
                                                        label:
                                                            deletingId === supportCategory.supportCategoryId
                                                                ? "Eliminando..."
                                                                : "Eliminar",
                                                        onClick: () => handleDeleteClick(supportCategory.supportCategoryId, supportCategory.code),
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
            {supportCategories.length > 0 && totalPages > 1 && (
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