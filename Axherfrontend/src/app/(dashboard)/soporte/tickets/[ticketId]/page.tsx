import SupportTicketDetail from "@/features/supportTicket/components/SupportTicketDetail";

interface Props {
    params: Promise<{
        ticketId: string;
    }>;
}

export default async function SupportTicketPage({
    params,
}: Props) {

    const { ticketId } = await params;

    return (
        <main>
            <SupportTicketDetail
                ticketId={Number(ticketId)}
            />
        </main>
    );
}