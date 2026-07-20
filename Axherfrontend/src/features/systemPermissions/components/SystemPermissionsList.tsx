import { SystemPermissions } from "@/entities/types";
import Pagination from "@/shared/components/ui/Pagination";
import tableStyles from "@/shared/styles/shared/Table.module.css";
import { useState } from "react";
import ConfirmDialog from "../../../shared/components/ui/ConfirmDialog";
import MoreMenu from "../../../shared/components/ui/MoreMenu";

interface Props{
    systemPermissions: SystemPermissions[];
    onDelete: (id: number) => void;
    onEdit: (systemPermissions: SystemPermissions) => void;
    deletingId?: number | null;
    loading?: boolean;

    currentPage: number;
    totalPages: number;
    onNextPage: () => void;
    onPrevPage: () => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;
}

export default function SystemPermissionsList ({
    systemPermissions,
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

    const [confirmDialog, setConfirmDialog] = useState<{isOpen: boolean; id: number; systemPermissions: string }>({
        isOpen: false,
        id: 0,
        systemPermissions: "",
    })

    const handleDeleteClick = (id: number, systemPermissions: string) => {
        setConfirmDialog({isOpen: true, id, systemPermissions})
    }

    const handleConfirmDelete = () => {
        onDelete(confirmDialog.id);
        setConfirmDialog({isOpen: false, id: 0, systemPermissions: ""})
    }

    const handleCancelDelete = () => {
        setConfirmDialog({isOpen: false, id: 0, systemPermissions: ""})
    }

    return (

        <div>
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title="confirmar Eliminacion"
                message={`¿Estás seguro de que deseas eliminar el permiso del sistema "${confirmDialog.systemPermissions}"? Esta accion no se puede deshacer.`}
                confirmText="Eliminar"
                cancelText="Cancelar"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                variant="danger"
            />

            <h2>Permisos del Sistema</h2>

            <div className={tableStyles.searchBox}>
                <input
                    type="text"
                    placeholder="Buscar permisos..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className={tableStyles.searchInput}
                />
            </div>
            {systemPermissions.length === 0 ? (
                <p>{loading ? "Buscando..." : "No hay permisos con ese término"}</p>
            ) : (
                <div className={`${tableStyles.tableWrap} ${loading ? tableStyles.loading : ""}`}>
                    <table className={tableStyles.table}>
                        <thead>
                            <tr className={tableStyles.rowHover}>
                                <th className={`${tableStyles.headCell} ${tableStyles.idColumn}`}>ID</th>
                                <th className={tableStyles.headCell}>Nombre del modulo</th>
                                <th className={tableStyles.headCell}>Accion</th>
                                <th className={tableStyles.headCell}>Nombre del permiso</th>
                                <th className={tableStyles.headCell}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {systemPermissions.map((permission) => (
                                <tr key={permission.systemPermissionId} className={tableStyles.rowHover}>
                                    <td className={`${tableStyles.cell} ${tableStyles.idColumn}`}>{permission.systemPermissionId}</td>
                                    <td className={tableStyles.cell}>{permission.moduleName}</td>
                                    <td className={tableStyles.cell}>{permission.actionName}</td>
                                    <td className={tableStyles.cell}>{permission.permissionName}</td>
                                    <td className={`${tableStyles.cell} ${tableStyles.actions}`}>
                                        <MoreMenu
                                            items={[
                                                {
                                                    label: "Editar",
                                                    onClick: () => onEdit(permission),
                                                },
                                                {
                                                    label:
                                                        deletingId === permission.systemPermissionId
                                                            ? "Eliminando..."
                                                            : "Eliminar",
                                                    onClick: () => handleDeleteClick(permission.systemPermissionId, permission.permissionName),
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
            {systemPermissions.length > 0 && totalPages > 1 && (
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