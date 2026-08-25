"use client";

import { LanguageResponse } from "@/entities/types";
import { useLanguage } from "@/features/language/hooks/useLanguage";
import { useLanguageActions } from "@/features/language/hooks/useLanguageActions";
import { useRouter } from "next/navigation";

import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import Button from "@/shared/components/ui/Button";
import LanguageList from "@/features/language/components/LanguageList";
import { useTranslations } from "next-intl";

export default function LanguageListView() {

    const router = useRouter();
    const common = useTranslations("common");
    const t = useTranslations("language");
    const {
        languages,
        loading,
        currentPage,
        totalPages,
        nextPage,
        prevPage,
        searchTerm,
        setSearchTerm,
        refetch
    } = useLanguage();

    const {
        deleting,
        removeLanguage
    } = useLanguageActions({
        onSuccess: refetch,
    });

    const handleCreate = () => {
        router.push("/admin/languages/create");
    };

    const handleEdit = (language: LanguageResponse) => {
        router.push(
            `/admin/languages/${language.languageId}/edit`
        );
    };

    return (
        <div className={layoutStyles.pageContainer}>

            <div className={layoutStyles.header}>
                <h1>{t("title")}</h1>

                <Button
                    variant="animated"
                    onClick={handleCreate}
                >
                    {common("new")}
                </Button>
            </div>

            <LanguageList
                languages={languages}
                onDelete={removeLanguage}
                onEdit={handleEdit}
                deletingId={deleting}
                loading={loading}
                currentPage={currentPage}
                totalPages={totalPages}
                onPrevPage={prevPage}
                onNextPage={nextPage}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
            />

        </div>
    );
}
