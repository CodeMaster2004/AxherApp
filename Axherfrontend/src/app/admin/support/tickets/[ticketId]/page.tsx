import AdminSupportTicketDetail from "@/features/supportTicket/components/AdminSupportTicketDetail";

interface Props {
    params: Promise<{
        ticketId: string;
    }>;
}

export default async function AdminSupportTicketDetailPage({
    params,
}: Props) {

    const { ticketId } = await params;

    return (
        <AdminSupportTicketDetail
            ticketId={Number(ticketId)}
        />
    );
}