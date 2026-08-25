"use client";

import { Discounts} from "@/entities/types";
import DiscountsList from "@/features/discounts/components/DiscountsList";
import { useDiscounts, useDiscountsActions } from "@/features/discounts/hooks";
import Button from "@/shared/components/ui/Button";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";


export default function DiscountsListView(){
    const router = useRouter();
    const t = useTranslations("common");
    const {discounts, loading, currentPage, totalPages, nextPage, prevPage, searchTerm, setSearchTerm, refetch} = useDiscounts();

    const {
        deleting,
        removeDiscounts,
    } = useDiscountsActions({
        onSuccess: refetch,
    });

    const handleCreate = () => {
        router.push("/admin/discounts/create");
    };

    const handleEdit = (discounts: Discounts) => {
        router.push(`/admin/discounts/${discounts.discountId}/edit`);
    }

    return(
        <div className={layoutStyles.pageContainer}>
            <div className={layoutStyles.header}>
                <h1>Descuentos</h1>
                <Button variant="animated" onClick={handleCreate}>
                    {t("new")}
                </Button>

            </div>
            <DiscountsList
                discounts={discounts}
                onDelete={removeDiscounts}
                onEdit={handleEdit}
                deletingId={deleting}
                loading={loading}
                currentPage={currentPage}
                totalPages={totalPages}
                onNextPage={nextPage}
                onPrevPage={prevPage}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
            
            />
        </div>
        
    )


}