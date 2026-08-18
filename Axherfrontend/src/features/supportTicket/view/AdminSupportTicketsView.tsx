"use client";

import { useSupportCategory } from "@/features/supportCategory/hooks/useSupportCategory";
import AdminSupportTicketList from "@/features/supportTicket/components/AdminSupportTicketList";
import { useAdminSupportTicketActions } from "@/features/supportTicket/hooks/useAdminSupportTicketActions";
import { useAdminSupportTickets } from "@/features/supportTicket/hooks/useAdminSupportTickets";
import { useSupportTicketStatus } from "@/features/supportTicketStatus/hooks/useSupportTicketStatus";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";

export default function AdminSupportTicketsView() {

    const {
        supportTicketStatus,
        loading: statusesLoading
    } = useSupportTicketStatus();

    const {
        supportCategory: categories,
        loading: categoriesLoading,
    } = useSupportCategory();

    const {
        tickets,
        loading,
        currentPage,
        totalPages,
        nextPage,
        prevPage,
        filters,
        setFilters,
        refetch,
    } = useAdminSupportTickets();

    const {
        saving,
        error,
        updateStatus,
    } = useAdminSupportTicketActions({onSuccess: refetch});

    return (
        <div className={layoutStyles.pageContainer}>

            <div className={layoutStyles.header}>
                <h1>Tickets de soporte</h1>
            </div>

            <AdminSupportTicketList
                tickets={tickets}
                statuses={supportTicketStatus}
                categories={categories}
                filters={filters}
                onFiltersChange={setFilters}

                onUpdateStatus={(ticketId, statusId) =>
                    updateStatus(ticketId, {
                        supportTicketStatusId: statusId,
                    })
                }

                loading={
                    loading ||
                    saving ||
                    statusesLoading ||
                    categoriesLoading
                }

                currentPage={currentPage}
                totalPages={totalPages}

                onNextPage={nextPage}
                onPrevPage={prevPage}
            />

            {error && (
                <p>{error}</p>
            )}

        </div>
    );
    
}