"use client";

import { ContentShelf, ShelfTarget } from "@/entities/types";
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
    const [target, setTarget] = useState<ShelfTarget>(ShelfTarget.HOME);
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

    } = useShelves({target});

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
            <div className={layoutStyles.pageTabs}>
                <Button
                    variant="tab"
                    active={target === ShelfTarget.HOME}
                    onClick={() => setTarget(ShelfTarget.HOME)}
                >
                    Home
                </Button>

                <Button
                    variant="tab"
                    active={target === ShelfTarget.MOVIES}
                    onClick={() => setTarget(ShelfTarget.MOVIES)}
                >
                    Películas
                </Button>

                <Button
                    variant="tab"
                    active={target === ShelfTarget.SERIES}
                    onClick={() => setTarget(ShelfTarget.SERIES)}
                >
                    Series
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