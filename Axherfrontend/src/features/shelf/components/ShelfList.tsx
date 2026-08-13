"use client";

import { ContentShelf } from "@/entities/types";
import { useState } from "react";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import ConfirmDialog from "@/shared/components/ui/ConfirmDialog";
import tableStyles from "@/shared/styles/shared/Table.module.css";
import { shelfLayoutOptions, shelfSourceOptions, shelfTargetOptions } from "@/shared/constants/selectOptions";
import BubbleToggle from "@/shared/components/ui/BubbleToggle";
import MoreMenu from "@/shared/components/ui/MoreMenu";
import Pagination from "@/shared/components/ui/Pagination";

interface Props {

    shelves: ContentShelf[];

    onEdit: (shelf: ContentShelf) => void;
    onDelete: (id: number) => void;
    onToggle: (id: number) => void;

    onManageContents: (shelf: ContentShelf) => void;

    deletingId?: number | null;
    togglingId?: number | null;
    loading?: boolean;

    currentPage: number;
    totalPages: number;

    onNextPage: () => void;
    onPrevPage: () => void;

    searchTerm: string;
    onSearchChange: (value: string) => void;
}

export default function ShelfList({
    shelves,

    onEdit,
    onDelete,
    onToggle,

    onManageContents,

    deletingId,
    togglingId,
    loading,

    currentPage,
    totalPages,

    onNextPage,
    onPrevPage,

    searchTerm,
    onSearchChange
}: Props) {

    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        id: 0,
        title: ""
    });

    const handleDeleteClick = (
        id: number,
        title: string
    ) => {

        setConfirmDialog({
            isOpen: true,
            id,
            title
        });

    };

    const handleConfirmDelete = () => {

        onDelete(confirmDialog.id);

        setConfirmDialog({
            isOpen: false,
            id: 0,
            title: ""
        });

    };

    return (

        <div className={layoutStyles.section}>

            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title="Eliminar carrusel"
                message={`¿Deseas eliminar "${confirmDialog.title}"?`}
                confirmText="Eliminar"
                cancelText="Cancelar"
                variant="danger"
                onConfirm={handleConfirmDelete}
                onCancel={() =>
                    setConfirmDialog({
                        isOpen: false,
                        id: 0,
                        title: ""
                    })
                }
            />

            <h2>Lista de Carruseles</h2>

            <div className={tableStyles.searchBox}>
                <input
                    type="text"
                    placeholder="Buscar carrusel..."
                    value={searchTerm}
                    onChange={(e) =>
                        onSearchChange(e.target.value)
                    }
                    className={tableStyles.searchInput}
                />
            </div>

            {
                shelves.length === 0 ? (

                    <p>
                        {
                            loading
                                ? "Cargando carruseles..."
                                : "No se encontraron carruseles."
                        }
                    </p>

                ) : (

                    <div className={tableStyles.tableWrap}>

                        <table className={tableStyles.table}>

                            <thead>

                                <tr>

                                    <th className={`${tableStyles.headCell} ${tableStyles.idColum}`}>ID</th>
                                    <th className={tableStyles.headCell}>Nombre</th>
                                    <th className={tableStyles.headCell}>Slug</th>
                                    <th className={tableStyles.headCell}>Target</th>
                                    <th className={tableStyles.headCell}>Layout</th>
                                    <th className={tableStyles.headCell}>Source</th>
                                    <th className={tableStyles.headCell}>Estado</th>
                                    <th className={tableStyles.actionsColumn}>Acciones</th>

                                </tr>

                            </thead>

                            <tbody>

                                {
                                    shelves.map((shelf) => (

                                        <tr key={shelf.contentShelfId}>

                                            <td>{shelf.contentShelfId}</td>

                                            <td>{shelf.name}</td>

                                            <td>{shelf.slug}</td>

                                            <td>
                                                {
                                                    shelfTargetOptions.find(
                                                        option =>
                                                            option.value === shelf.target
                                                    )?.label
                                                }
                                            </td>

                                            <td>
                                                {
                                                    shelfLayoutOptions.find(
                                                        option =>
                                                            option.value === shelf.layout
                                                    )?.label
                                                }
                                            </td>

                                            <td>
                                                {
                                                    shelfSourceOptions.find(
                                                        option =>
                                                            option.value === shelf.source
                                                    )?.label
                                                }
                                            </td>

                                            <td>

                                                <BubbleToggle
                                                    checked={shelf.active}
                                                    onChange={() =>
                                                        onToggle(shelf.contentShelfId)
                                                    }
                                                    disabled={
                                                        togglingId ===
                                                        shelf.contentShelfId
                                                    }
                                                />

                                            </td>

                                            <td>

                                                <MoreMenu
                                                    items={[
                                                        {
                                                            label:"Administrar contenido",
                                                            onClick:()=>onManageContents(shelf)
                                                        },
                                                        {
                                                            label: "Editar",
                                                            onClick: () =>
                                                                onEdit(shelf)
                                                        },
                                                        {
                                                            label:
                                                                deletingId ===
                                                                shelf.contentShelfId
                                                                    ? "Eliminando..."
                                                                    : "Eliminar",

                                                            variant: "danger",

                                                            onClick: () =>
                                                                handleDeleteClick(
                                                                    shelf.contentShelfId,
                                                                    shelf.name
                                                                )
                                                        }
                                                    ]}
                                                />

                                            </td>

                                        </tr>

                                    ))
                                }

                            </tbody>

                        </table>

                    </div>

                )
            }

            {
                shelves.length > 0 &&
                totalPages > 1 && (

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onNextPage={onNextPage}
                        onPrevPage={onPrevPage}
                    />

                )
            }

        </div>

    );

}