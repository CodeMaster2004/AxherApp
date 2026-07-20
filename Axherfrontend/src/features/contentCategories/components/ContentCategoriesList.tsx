// src/components/CategoriasList.tsx
import { ContentCategories } from "@/entities/types";
import MoreMenu from "@/shared/components/ui/MoreMenu";
import Pagination from "@/shared/components/ui/Pagination";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import tableStyles from "@/shared/styles/shared/Table.module.css";
import { useState } from "react";
import ConfirmDialog from "../../../shared/components/ui/ConfirmDialog";

interface Props {
  contentCategories: ContentCategories[];
  onDelete: (id: number) => void;
  onEdit: (contentCategories: ContentCategories) => void;
  deletingId?: number | null;
  loading?: boolean;

  currentPage: number;
  totalPages: number;
  onNextPage: () => void;
  onPrevPage: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export default function ContentCategoriesList({ contentCategories, onDelete, onEdit, deletingId, loading, currentPage, totalPages, onNextPage, onPrevPage, searchTerm, onSearchChange }: Props) {
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; id: number; name: string }>({
    isOpen: false,
    id: 0,
    name: "",
  });

  const handleDeleteClick = (id: number, name: string) => {
    setConfirmDialog({ isOpen: true, id, name });
  };

  const handleConfirmDelete = () => {
    onDelete(confirmDialog.id);
    setConfirmDialog({ isOpen: false, id: 0, name: "" });
  };

  const handleCancelDelete = () => {
    setConfirmDialog({ isOpen: false, id: 0, name: "" });
  };

  

  return (
    <div className={layoutStyles.section}>
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Confirmar Eliminación"
        message={`¿Estás seguro de que deseas eliminar la categoría "${confirmDialog.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        variant="danger"
      />
      <h2>Lista de Categorías</h2>
      
      <div className={tableStyles.searchBox}>
        <input
          type="text"
          placeholder="Buscar por nombre o descripción..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className={tableStyles.searchInput}
        />
      </div>
      
      {contentCategories.length === 0 ? (
        <p>{loading ? "Buscando..." : "No hay categorías registradas con ese termino."}</p>
      ) : (
        <div className={`${tableStyles.tableWrap} ${loading ? tableStyles.loading : ""}`}>
          <table className={tableStyles.table}>
            <thead>
              <tr className={tableStyles.rowHover}>
                <th className={`${tableStyles.headCell} ${tableStyles.idColumn}`}>ID</th>
                <th className={tableStyles.headCell}>Categoría</th>
                <th className={tableStyles.headCell}>Descripción</th>
                <th className={tableStyles.headCell}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {contentCategories.map((contentCategories) => (
                <tr key={contentCategories.contentCategoryId} className={tableStyles.rowHover}>
                  <td className={`${tableStyles.cell} ${tableStyles.idColumn}`}>{contentCategories.contentCategoryId}</td>
                  <td className={tableStyles.cell}>{contentCategories.name}</td>
                  <td className={tableStyles.cell}>{contentCategories.description}</td>
                  <td className={`${tableStyles.cell} ${tableStyles.actions}`}>
                    {/* Menú de tres puntos con opciones de fila */}
                    <MoreMenu
                      items={[
                        {
                          label: "Editar",
                          onClick: () => onEdit(contentCategories),
                        },
                        {
                          label:
                            deletingId === contentCategories.contentCategoryId
                              ? "Eliminando..."
                              : "Eliminar",
                          onClick: () => handleDeleteClick(contentCategories.contentCategoryId, contentCategories.name),
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
      {contentCategories.length > 0 && totalPages > 1 && (
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

