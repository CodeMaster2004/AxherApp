"use client";

import SupportTicketList from "@/features/supportTicket/components/SupportTicketList";
import { useSupportTickets } from "@/features/supportTicket/hooks/useSupportTickets";
import { useRouter } from "next/navigation";

export default function SupportTicketListView() {

    const {
        tickets,
        loading,
        currentPage,
        totalPages,
        nextPage,
        prevPage,
    } = useSupportTickets();

    return (
        <SupportTicketList
            tickets={tickets}
            loading={loading}
            currentPage={currentPage}
            totalPages={totalPages}
            onNextPage={nextPage}
            onPrevPage={prevPage}
            
        />
    );
}