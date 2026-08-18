"use client";

import { SupportTicketStatusResponse } from "@/entities/types";
import { useSupportTicketStatus } from "@/features/supportTicketStatus/hooks/useSupportTicketStatus";
import { useSupportTicketStatusActions } from "@/features/supportTicketStatus/hooks/useSupportTicketStatusActions";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import Button from "@/shared/components/ui/Button";
import SupportTicketStatusList from "@/features/supportTicketStatus/components/SupportTicketStatusList";
import { useRouter } from "next/navigation";

export default function SupportTicketStatusListView() {

    const router = useRouter();
    const {
        supportTicketStatus,
        loading,
        currentPage,
        totalPages,
        nextPage,
        prevPage,
        searchTerm,
        setSearchTerm,
        refetch
    } = useSupportTicketStatus();

    const {deleting, removeSupportTicketStatus} = useSupportTicketStatusActions({
        onSuccess: refetch,
    });

    const handleCreate = () => {
        router.push("/admin/support/ticket-status/create");
    }

    const handleEdit = (supportTicketStatus: SupportTicketStatusResponse) => {
        router.push(`/admin/support/ticket-status/${supportTicketStatus.supportTicketStatusId}/edit`);
    }

    return (

        <div className={layoutStyles.pageContainer}>
            <div className={layoutStyles.header}>
                <h1>Estados de tickets de soporte</h1>
                <Button
                    variant="animated"
                    onClick={handleCreate}
                >
                    Nuevo
                </Button>
            </div>
            <SupportTicketStatusList
                supportTicketStatus={supportTicketStatus}
                onDelete={removeSupportTicketStatus}
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

    )
}