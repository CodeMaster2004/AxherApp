"use client";

import ShelfContentAddForm from "@/features/shelf/components/ShelfContentAddForm";
import ShelfContentList from "@/features/shelf/components/ShelfContentList";
import { useShelfContentActions } from "@/features/shelf/hooks/useShelfContentActions";
import { useShelfContents } from "@/features/shelf/hooks/useShelfContents";
import Modal from "@/shared/components/ui/Modal";
import { useTranslations } from "next-intl";

interface Porps {
    shelfId: number;
    open: boolean;
    onClose: () => void;
}

export default function ShelfContentsModal({
    shelfId,
    open,
    onClose
}: Porps) {

    const t = useTranslations("shelves");

    const {
        contents,
        loading,
        refetch
    } = useShelfContents(shelfId);


    const {
        addContent,
        updatePosition,
        removeContent,

        saving,
        deleting,
        error
    } = useShelfContentActions({
        onSuccess(){
            refetch();
        }
    });

    if(!open) return null;

    return (

        <Modal
            open={open}
            title={t("manageContent")}
            onClose={onClose}
            size="xl"
        >

            <ShelfContentAddForm
                saving={saving}
                error={
                    error
                    ? t("content.error")
                    : undefined
                }
                onSubmit={(contentId,position)=>{
                    addContent(
                        shelfId,
                        {
                            contentId,
                            position: position || undefined
                        }
                    );
                }}
            />


            <ShelfContentList
                contents={contents}
                loading={loading}
                deletingId={deleting}
                onUpdatePosition={(shelfContentId,position)=>{
                    updatePosition(
                        shelfId,
                        shelfContentId,
                        {
                            position
                        }
                    );
                }}
                onDelete={(shelfContentId)=>{
                    removeContent(
                        shelfId,
                        shelfContentId
                    );
                }}
            />

        </Modal>
    )
}