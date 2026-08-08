"use client";

import { ShelfContent } from "@/entities/types";
import Button from "@/shared/components/ui/Button";
import ConfirmDialog from "@/shared/components/ui/ConfirmDialog";
import SortableList from "@/shared/components/ui/SortableList";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./ShelfContentList.module.css";

interface Props {

    contents: ShelfContent[];

    onUpdatePosition: (
        shelfContentId: number,
        position: number
    ) => void;

    onDelete: (
        shelfContentId: number
    ) => void;

    deletingId?: number | null;

    loading?: boolean;
}

export default function ShelfContentList({
    contents,
    onUpdatePosition,
    onDelete,
    deletingId,
    loading = false
}: Props) {

    const [items, setItems] = useState(contents);

    useEffect(() => {
        setItems(contents);
    }, [contents]);


    const [
        confirmDialog,
        setConfirmDialog
    ] = useState({

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

        onDelete(
            confirmDialog.id
        );

        setConfirmDialog({

            isOpen: false,

            id: 0,

            title: ""

        });
    };


    return (

        <div className={layoutStyles.section}>

            <ConfirmDialog

                isOpen={
                    confirmDialog.isOpen
                }

                title="Eliminar contenido"

                message={
                    `¿Eliminar "${confirmDialog.title}" del carrusel?`
                }

                confirmText="Eliminar"

                cancelText="Cancelar"

                variant="danger"

                onConfirm={
                    handleConfirmDelete
                }

                onCancel={() =>
                    setConfirmDialog({

                        isOpen: false,

                        id: 0,

                        title: ""

                    })
                }

            />


            <h2>
                Contenido del Carrusel
            </h2>


            {
                items.length === 0 ? (

                    <p>
                        {
                            loading
                                ? "Cargando contenidos..."
                                : "Este carrusel no tiene contenido."
                        }
                    </p>

                ) : (

                    <div className={styles.list}>

                        <SortableList

                            items={items}

                            getId={
                                item =>
                                    item.shelfContentId
                            }

                            onChange={
                                setItems
                            }

                            onMove={
                                onUpdatePosition
                            }

                            renderItem={(
                                item,
                                index,
                                dragHandle
                            ) => (

                                <div
                                    className={
                                        styles.item
                                    }
                                >

                                    <div
                                        className={
                                            styles.handle
                                        }
                                    >
                                        {dragHandle}
                                    </div>


                                    <div
                                        className={
                                            styles.posterWrapper
                                        }
                                    >

                                        {
                                            item.posterUrl ? (

                                                <Image
                                                    src={
                                                        item.posterUrl
                                                    }
                                                    alt={
                                                        item.title
                                                    }
                                                    width={70}
                                                    height={100}
                                                    className={
                                                        styles.poster
                                                    }
                                                />

                                            ) : (

                                                <div
                                                    className={
                                                        styles.posterPlaceholder
                                                    }
                                                >
                                                    🎬
                                                </div>

                                            )
                                        }

                                    </div>


                                    <div
                                        className={
                                            styles.info
                                        }
                                    >

                                        <h3>
                                            {
                                                item.title
                                            }
                                        </h3>

                                        <div
                                            className={
                                                styles.meta
                                            }
                                        >

                                            <span>
                                                Posición {
                                                    index + 1
                                                }
                                            </span>

                                        </div>

                                    </div>


                                    <div
                                        className={
                                            styles.actions
                                        }
                                    >

                                        <Button
                                            variant="secondary"
                                            type="button"
                                            disabled={
                                                deletingId ===
                                                item.shelfContentId
                                            }
                                            onClick={() =>
                                                handleDeleteClick(
                                                    item.shelfContentId,
                                                    item.title
                                                )
                                            }
                                        >

                                            {
                                                deletingId ===
                                                item.shelfContentId
                                                    ? "Eliminando..."
                                                    : "Eliminar"
                                            }

                                        </Button>

                                    </div>

                                </div>

                            )}

                        />

                    </div>

                )
            }

        </div>
    );
}