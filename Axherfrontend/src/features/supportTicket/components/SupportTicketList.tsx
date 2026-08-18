"use client";

import { SupportTicketResponse } from "@/entities/types";
import SupportTicketCard from "@/features/supportTicket/components/SupportTicketCard";
import Button from "@/shared/components/ui/Button";
import Pagination from "@/shared/components/ui/Pagination";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import { useRouter } from "next/navigation";
interface Props {
    tickets: SupportTicketResponse[];
    loading: boolean;

    currentPage: number;
    totalPages: number;

    onNextPage: () => void;
    onPrevPage: () => void;
}

export default function SupportTicketList({
    tickets,
    loading,
    currentPage,
    totalPages,
    onNextPage,
    onPrevPage,
}: Props) {

    const router = useRouter();

    const handleTicketClick = (ticketId: number) => {
        router.push(`/soporte/tickets/${ticketId}`);
    };

    const handleCreateTicket = () => {
        router.push("/soporte/tickets/nuevo");
    };


    return (
        <section className={layoutStyles.pageContainer}>

            <h2>Mis tickets</h2>
            <p>
                Consulta tus solicitudes y conversaciones
                con soporte.
            </p>
            <Button
                type="button"
                variant="animated"
                onClick={handleCreateTicket}
            >
                Nuevo
            </Button>

            {tickets.length === 0 ? (
                <div>
                    {loading
                        ? "Cargando tickets..."
                        : "No tienes tickets de soporte."
                    }
                </div>
            ) : (
                <div>
                    {tickets.map((ticket) => (
                        <SupportTicketCard
                            key={ticket.supportTicketId}
                            ticket={ticket}
                            onClick={() =>
                                handleTicketClick(
                                    ticket.supportTicketId
                                )
                            }
                        />
                    ))}
                </div>
            )}

            {tickets.length > 0 && totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onNextPage={onNextPage}
                    onPrevPage={onPrevPage}
                />
            )}

        </section>
    );
}