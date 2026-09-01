"use client";

import { SupportFaqResponse } from "@/entities/types/supportFaq.types";
import SupportFaqList from "@/features/faqs/components/SupportFaqList";
import { useSupportFaqActions } from "@/features/faqs/hooks/useSupportFaqActions";
import { useSupportFaqs } from "@/features/faqs/hooks/useSupportFaqs";
import { useSupportCategory } from "@/features/supportCategory/hooks/useSupportCategory";
import Button from "@/shared/components/ui/Button";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";

export default function SupportFaqView() {

    const router = useRouter();

    const t = useTranslations("supportFaq");
    const common = useTranslations("common");

    const {
        faqs,
        loading,
        currentPage,
        totalPages,
        
        nextPage,
        prevPage,

        searchTerm,
        setSearchTerm,

        filters,
        setFilters,

        refetch
    } = useSupportFaqs();

    const {
        deleting,
        toggling,
        moving,

        removeFaq,
        toggleActive,
        moveFaq
    } = useSupportFaqActions({
        onSuccess: refetch,
    })

    const {
        supportCategory,
        loading: categoriesLoading,
    } = useSupportCategory();

    const handleCreate = () => {
        router.push("/admin/faqs/create");
    }

    const handleEdit = (faq: SupportFaqResponse) => {
        router.push(`/admin/faqs/${faq.supportFaqId}/edit`);
    }

    const handleMove = async(id: number, displayOrder: number) => {
        await moveFaq(id, displayOrder);
    }

    const handleTranslations = (
        faq: SupportFaqResponse
    ) => {

        router.push(
            `/admin/faqs/${faq.supportFaqId}/translations`
        );

    };

    return (

        <div className={layoutStyles.pageContainer}>
            <div>
                <h1>{t("title")}</h1>
                <Button onClick={handleCreate} variant="animated">
                    {common("create")}
                </Button>
            </div>
            
            <SupportFaqList
                faqs={faqs}
                categories={supportCategory}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                filters={filters}
                onFiltersChange={setFilters}
                onEdit={handleEdit}
                onDelete={removeFaq}
                onToggle={toggleActive}
                onMove={handleMove}
                onTranslations={handleTranslations}

                deletingId={deleting}
                togglingId={toggling}
                movingId={moving}

                loading={loading}

                currentPage={currentPage}
                totalPages={totalPages}

                onNextPage={nextPage}
                onPrevPage={prevPage}
            />
        </div>
    )
}