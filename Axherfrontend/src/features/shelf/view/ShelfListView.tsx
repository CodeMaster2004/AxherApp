"use client";

import { ContentShelf } from "@/entities/types";
import { useShelfActions } from "@/features/shelf/hooks/useShelfActions";
import { useShelves } from "@/features/shelf/hooks/useContentShelf";
import { useRouter } from "next/navigation";
import { useState } from "react";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import Button from "@/shared/components/ui/Button";
import ShelfContentsModal from "@/features/shelf/components/ShelfContentsModal";
import ShelfList from "@/features/shelf/components/ShelfList";

export default function ShelfListView() {

    const router = useRouter();

    const {
        shelves,
        loading,
        currentPage,
        totalPages,
        nextPage,
        prevPage,
        searchTerm,
        setSearchTerm,
        refetch

    } = useShelves();

    const {
        deleting,
        toggleShelf,
        removeShelf

    } = useShelfActions({
        onSuccess: refetch
    });

    const [selectedShelf,setSelectedShelf] =
        useState<number | null>(null);



    const handleCreate = () => {
        router.push("/shelves/create");
    };



    const handleEdit = (
        shelf:ContentShelf
    )=>{

        router.push(
            `/shelves/${shelf.contentShelfId}/edit`
        );

    };



    const handleManageContents = (
        shelf:ContentShelf
    )=>{

        setSelectedShelf(
            shelf.contentShelfId
        );

    };

    return (

        <div className={layoutStyles.pageContainer}>
            <div className={layoutStyles.header}>

                <h1>Carruseles</h1>
                <Button
                    variant="animated"
                    onClick={handleCreate}
                >
                    Crear Carrusel
                </Button>
            </div>

            <ShelfList

                shelves={shelves}
                onEdit={handleEdit}
                onDelete={removeShelf}
                onToggle={toggleShelf}
                onManageContents={
                    handleManageContents
                }
                deletingId={deleting}
                loading={loading}
                currentPage={currentPage}
                totalPages={totalPages}
                onNextPage={nextPage}
                onPrevPage={prevPage}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}

            />

            {
                selectedShelf && (
                    <ShelfContentsModal
                        shelfId={selectedShelf}
                        open={true}
                        onClose={()=>
                            setSelectedShelf(null)
                        }
                    />

                )
            }

        </div>

    )

}