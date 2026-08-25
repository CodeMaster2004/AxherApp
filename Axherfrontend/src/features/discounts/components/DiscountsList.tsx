import { Discounts } from "@/entities/types";
import Pagination from "@/shared/components/ui/Pagination";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import tableStyles from "@/shared/styles/shared/Table.module.css";
import { useState } from "react";
import ConfirmDialog from "../../../shared/components/ui/ConfirmDialog";
import MoreMenu from "../../../shared/components/ui/MoreMenu";
import { useTranslations } from "next-intl";

interface Props{
    discounts: Discounts[];
    onDelete: (id: number) => void;
    onEdit: (discounts: Discounts) => void;
    deletingId?: number | null;
    loading?: boolean;

    currentPage: number;
    totalPages: number;
    onNextPage: () => void;
    onPrevPage: () => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;
}

export default function DiscountsList ({discounts, onDelete, onEdit, deletingId, loading, currentPage, totalPages, onNextPage, onPrevPage, searchTerm, onSearchChange}: Props){
    const [confirmDialog, setConfirmDialog] = useState<{isOpen: boolean; id: number; discountType: string}>({

        isOpen: false,
        id: 0,
        discountType: "",
    });

    // Convertir string "YYYY-MM-DD" a formato legible (DD/MM/YYYY)
    const formatDate = (dateStr: string): string => {
        if (!dateStr) return '-';
        // Parsear "YYYY-MM-DD" manualmente para evitar problemas de timezone
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
    };

    const handleDeleteClick = (id: number, discountType: string) => {
        setConfirmDialog({isOpen: true, id, discountType})
    };

    const handleConfirmDelete = () => {
        onDelete(confirmDialog.id);
        setConfirmDialog({isOpen: false, id: 0, discountType: ""});
    };

    const handleCancelDelete = () => {
        setConfirmDialog({isOpen: false, id: 0, discountType: ""})
    };

    const t = useTranslations("common");

    return(
        <div className={layoutStyles.section}>
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title="confirmar Eliminacion"
                message={`¿Estás seguro de que deseas eliminar el descuento "${confirmDialog.discountType}"? Esta accion no se puede deshacer.`}
                confirmText={t("delete")}
                cancelText={t("cancel")}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                variant="danger"
            
            />

            <h2>Lista de Descuentos</h2>

            <div className={tableStyles.searchBox}>
                <input
                    type="text"
                    placeholder="Buscar descuentos..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className={tableStyles.searchInput}
                />
            </div>

            {discounts.length === 0 ? (
                <p>{loading ? "Buscando..." : "No hay descuentos regitrados con ese término"}</p>
            ) : (
                <div className={`${tableStyles.tableWrap} ${loading ? tableStyles.loading : ""}`}>
                    <table className={tableStyles.table}>
                        <thead>
                            <tr className={tableStyles.rowHover}>
                                <th className={`${tableStyles.headCell} ${tableStyles.idColumn}`}>ID</th>
                                <th className={tableStyles.headCell}>Descuento</th>
                                <th className={tableStyles.headCell}>Monto</th>
                                <th className={tableStyles.headCell}>Fecha de inicio</th>
                                <th className={tableStyles.headCell}>Fecha de fin</th>
                                <th className={tableStyles.headCell}>Descripcion</th>
                                <th className={tableStyles.headCell}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {discounts.map((discount) => (
                                <tr key={discount.discountId} className={tableStyles.rowHover}>
                                    <td className={`${tableStyles.cell} ${tableStyles.idColumn}`}>{discount.discountId}</td>
                                    <td className={tableStyles.cell}>{discount.discountType}</td>
                                    <td className={tableStyles.cell}>{discount.amount.toFixed(2)}%</td>
                                    <td className={tableStyles.cell}>{formatDate(discount.startDate)}</td>
                                    <td className={tableStyles.cell}>{formatDate(discount.endDate)}</td>
                                    <td className={tableStyles.cell}>{discount.description || "-"}</td>
                                    <td className={`${tableStyles.cell} ${tableStyles.actions}`}>
                                        <MoreMenu
                                            items={[
                                                {
                                                    label: t("edit"),
                                                    onClick: () => onEdit(discount),
                                                },
                                                {
                                                    label:
                                                        deletingId === discount.discountId
                                                            ? "Eliminando..."
                                                            : t("delete"),
                                                    onClick: () => handleDeleteClick(discount.discountId, discount.discountType),
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
            {discounts.length > 0 && totalPages > 1 && (
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