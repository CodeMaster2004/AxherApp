"use client";

import { HeroBanner } from "@/entities/types";
import { useState } from "react";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import tableStyles from "@/shared/styles/shared/Table.module.css";
import ConfirmDialog from "@/shared/components/ui/ConfirmDialog";
import Image from "next/image";
import MoreMenu from "@/shared/components/ui/MoreMenu";
import Pagination from "@/shared/components/ui/Pagination";
import BubbleToggle from "@/shared/components/ui/BubbleToggle";

interface Props {
    banners: HeroBanner[];
    onEdit:(banner:HeroBanner)=>void;
    onDelete:(id:number)=>void;
    

    onToggle:(id:number)=>void;

    deletingId?:number|null;
    togglingId?:number|null;
    loading?:boolean;

    currentPage:number;
    totalPages:number;
    onNextPage:()=>void;
    onPrevPage:()=>void;

    searchTerm:string;
    onSearchChange:(value:string)=>void;
}

export default function HeroBannerList({
    banners,

    onEdit,
    onDelete,
    onToggle,

    deletingId,
    togglingId,

    loading,

    currentPage,
    totalPages,

    onNextPage,
    onPrevPage,

    searchTerm,
    onSearchChange

}: Props){

    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        id: 0,
        title: "",
    });

    const handleDeleteClick = (id: number, title: string) => {
        setConfirmDialog({
            isOpen: true,
            id,
            title,
        });
    }

    const handleConfirmDelete = () => {
        onDelete(confirmDialog.id);
        setConfirmDialog({
            isOpen: false,
            id: 0,
            title: "",
        });
    }
        
    return (

        <div className={layoutStyles.section}>

            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title="Confirmar eliminación"
                message={`¿Estás seguro de que deseas eliminar el banner "${confirmDialog.title}"?`}
                confirmText="Eliminar"
                cancelText="Cancelar"
                variant="danger"
                onConfirm={handleConfirmDelete}
                onCancel={() => setConfirmDialog({ isOpen: false, id: 0, title: "" })}
            />

            <h2>Lista de Banners</h2>

            <div className={tableStyles.searchBox}>
                <input
                    type="text"
                    placeholder="Buscar banner..."
                    value={searchTerm}
                    onChange={(e)=>onSearchChange(e.target.value)}
                    className={tableStyles.searchInput}
                />

            </div>
            {
                banners.length === 0 ? (
                    <p>
                        {
                            loading
                            ? "Cargando banners..."
                            : "No se encontraron banners."
                        }
                    </p>
                ):(
                    <div className={tableStyles.tableWrap}>
                        <table className={tableStyles.table}>
                            <thead>
                                <tr>
                                    <th className={`${tableStyles.headCell} ${tableStyles.idColum}`}>ID</th>
                                    <th className={`${tableStyles.headCell} ${tableStyles.backdropColum}`}>Imagen</th>
                                    <th className={`${tableStyles.headCell} ${tableStyles.contentColum}`}>Contenido</th>
                                    <th className={`${tableStyles.headCell} ${tableStyles.priorityColum}`}>Prioridad</th>
                                    <th className={`${tableStyles.headCell} ${tableStyles.iniciColum}`}>Inicio</th>
                                    <th className={`${tableStyles.headCell} ${tableStyles.finColum}`}>Fin</th>
                                    <th className={`${tableStyles.headCell} ${tableStyles.estadoColum}`}>Estado</th>
                                    <th className={tableStyles.actionsColumn}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    banners.map((banner) => (
                                        <tr key={banner.heroBannerId}>

                                            <td>{banner.heroBannerId}</td>
                                            <td>
                                                {
                                                    banner.backdropUrl ?
                                                    <Image
                                                        src={banner.backdropUrl}
                                                        alt={banner.titleOverride || banner.contentTitle || "Hero banner"}
                                                        width={180}
                                                        height={100}
                                                        style={{objectFit:"cover"}}
                                                    />
                                                    :
                                                    "-"
                                                }
                                            </td>
                                            <td>
                                                <strong>
                                                {banner.contentTitle}
                                                </strong>
                                                <br/>
                                                {
                                                    banner.titleOverride && (
                                                        <small>
                                                            {banner.titleOverride}
                                                        </small>
                                                    )
                                                }
                                            </td>
                                            <td>{banner.priority}</td>
                                            <td>{banner.startDate ?? "-"}</td>
                                            <td>{banner.endDate ?? "-"}</td>
                                            <td>

                                                <BubbleToggle
                                                    checked={banner.active}
                                                    onChange={()=>onToggle(banner.heroBannerId)}
                                                    disabled={togglingId === banner.heroBannerId}
                                                />

                                            </td>
                                            <td>
                                                <MoreMenu
                                                    items={[
                                                        {
                                                            label: "Editar",
                                                            onClick: () => onEdit(banner),
                                                        },
                                                        {
                                                            label:
                                                            deletingId === banner.heroBannerId
                                                                ? "Eliminando..."
                                                                : "Eliminar",
                                                                variant: "danger",

                                                                onClick:() => handleDeleteClick(
                                                                    banner.heroBannerId,
                                                                    banner.contentTitle
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
                banners.length > 0 && totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}

                        totalPages={totalPages}

                        onNextPage={onNextPage}

                        onPrevPage={onPrevPage}
                    />
                )
            }
        </div>
    )
}