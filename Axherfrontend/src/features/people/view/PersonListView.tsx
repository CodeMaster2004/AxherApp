"use client";

import { PersonResponse } from "@/entities/types";
import { usePerson } from "@/features/people/hooks/usePerson";
import { usePersonActions } from "@/features/people/hooks/usePersonActions";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import Button from "@/shared/components/ui/Button";
import PersonList from "@/features/people/components/PersonList";

export default function PersonListView() {

    const router = useRouter();

    const t = useTranslations("person");
    const common = useTranslations("common");

    const {
        people,
        loading,
        currentPage,
        totalPages,
        nextPage,
        prevPage,
        searchTerm,
        setSearchTerm,
        refetch,
    } = usePerson();

    const {
        deleting,
        removePerson,
    } = usePersonActions({
        onSuccess: refetch,
    });

    const handleCreate = () => {
        router.push( "/admin/people/create" );
    };

    const handleEdit = (
        person: PersonResponse
    ) => {
        router.push( `/admin/people/${person.personId}/edit` );
    };

    return (
        <div className={ layoutStyles.pageContainer } >

            <div className={ layoutStyles.header } >

                <h1> {t("title")} </h1>

                <Button
                    variant="animated"
                    onClick={handleCreate}
                >
                    {common("create")}
                </Button>

            </div>

            <PersonList
                people={people}
                onEdit={handleEdit}
                onDelete={removePerson}
                deletingId={deleting}
                loading={loading}
                currentPage={currentPage}
                totalPages={totalPages}
                onNextPage={nextPage}
                onPrevPage={prevPage}
                searchTerm={searchTerm}
                onSearchChange={
                    setSearchTerm
                }
            />

        </div>
    );
}