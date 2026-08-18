"use client";

import { SupportTicketFilters, SupportTicketResponse } from "@/entities/types";
import Pagination from "@/shared/components/ui/Pagination";
import { formatDate } from "@/shared/utils/date";
import { useRouter } from "next/navigation";
import { useState } from "react";
import tableStyles from "@/shared/styles/shared/Table.module.css"
import layoutStyles from "@/shared/styles/layout/Layout.module.css"
import ConfirmDialog from "@/shared/components/ui/ConfirmDialog";

interface SupportTicketStatus {
    supportTicketStatusId: number;
    code: string;
    name: string;
}

interface SupportCategory {
    supportCategoryId: number;
    name: string;
}

interface Props {
    tickets: SupportTicketResponse[];
    statuses: SupportTicketStatus[];
    categories: SupportCategory[];

    filters: SupportTicketFilters;
    onFiltersChange: (
        filters: SupportTicketFilters
    ) => void;

    onUpdateStatus: (
        ticketId: number,
        statusId: number
    ) => void;

    loading?: boolean;

    currentPage: number;
    totalPages: number;

    onNextPage: () => void;
    onPrevPage: () => void;
}

export default function AdminSupportTicketList({
    tickets,
    statuses,
    categories,

    filters,
    onFiltersChange,

    onUpdateStatus,
    loading,

    currentPage,
    totalPages,

    onNextPage,
    onPrevPage,
}: Props){

    const router = useRouter();

    const [pendingStatus, setPendingStatus] = useState<
        Record<number, number | undefined>
    >({});

    const [statusDialog, setStatusDialog] = useState<{
        isOpen: boolean;
        ticketId: number;
        statusId: number;
        statusName: string;
    }>({
        isOpen: false,
        ticketId: 0,
        statusId: 0,
        statusName: "",
    });

    const handleFilterChange = (
        key: keyof SupportTicketFilters,
        value: string
    ) => {

        onFiltersChange({
            ...filters,
            [key]:
                value === ""
                    ? undefined
                    : key === "supportCategoryId"
                        ? Number(value)
                        : value,
        });
    };

    const handleStatusChange = (
        ticket: SupportTicketResponse,
        statusId: number
    ) => {

        const selectedStatus = statuses.find(
            status =>
                status.supportTicketStatusId === statusId
        );

        setPendingStatus(prev => ({
            ...prev,
            [ticket.supportTicketId]: statusId,
        }));

        setStatusDialog({
            isOpen: true,
            ticketId: ticket.supportTicketId,
            statusId,
            statusName: selectedStatus?.name ?? "",
        });
    };

    const handleConfirmStatus = () => {

        onUpdateStatus(
            statusDialog.ticketId,
            statusDialog.statusId
        );

        setPendingStatus(prev => {
            const copy = { ...prev };

            delete copy[statusDialog.ticketId];

            return copy;
        });

        handleCancelStatus();
    };

    const handleCancelStatus = () => {

        setPendingStatus(prev => {
            const copy = { ...prev };

            delete copy[statusDialog.ticketId];

            return copy;
        });

        setStatusDialog({
            isOpen: false,
            ticketId: 0,
            statusId: 0,
            statusName: "",
        });
    };

    const handleViewTicket = (
        ticketId: number
    ) => {
        router.push(
            `/admin/support/tickets/${ticketId}`
        );
    };

    return (
        <div className={layoutStyles.section}>

            <ConfirmDialog
                isOpen={statusDialog.isOpen}
                title="Cambiar estado"
                message={
                    `¿Seguro que deseas cambiar el ticket #${statusDialog.ticketId} a "${statusDialog.statusName}"?`
                }
                confirmText="Cambiar"
                cancelText="Cancelar"
                onConfirm={handleConfirmStatus}
                onCancel={handleCancelStatus}
                variant="info"
            />

            <h2>Tickets de soporte</h2>

            <div className={tableStyles.searchBox}>

                <input
                    type="text"
                    placeholder="Buscar tickets..."
                    value={filters.search ?? ""}
                    onChange={(e) =>
                        handleFilterChange(
                            "search",
                            e.target.value
                        )
                    }
                    className={tableStyles.searchInput}
                />

            </div>

            <div className={tableStyles.filters}>

                <select
                    value={filters.statusCode ?? ""}
                    onChange={(e) =>
                        handleFilterChange(
                            "statusCode",
                            e.target.value
                        )
                    }
                >
                    <option value="">
                        Todos los estados
                    </option>

                    {statuses.map(status => (
                        <option
                            key={
                                status.supportTicketStatusId
                            }
                            value={status.code}
                        >
                            {status.name}
                        </option>
                    ))}
                </select>

                <select
                    value={
                        filters.supportCategoryId ?? ""
                    }
                    onChange={(e) =>
                        handleFilterChange(
                            "supportCategoryId",
                            e.target.value
                        )
                    }
                >
                    <option value="">
                        Todas las categorías
                    </option>

                    {categories.map(category => (
                        <option
                            key={
                                category.supportCategoryId
                            }
                            value={
                                category.supportCategoryId
                            }
                        >
                            {category.name}
                        </option>
                    ))}
                </select>

                <input
                    type="number"
                    placeholder="ID de usuario"
                    value={filters.userId ?? ""}
                    onChange={(e) =>
                        handleFilterChange(
                            "userId",
                            e.target.value
                        )
                    }
                />

                <input
                    type="date"
                    value={
                        filters.createdAtFrom ?? ""
                    }
                    onChange={(e) =>
                        handleFilterChange(
                            "createdAtFrom",
                            e.target.value
                        )
                    }
                />

                <input
                    type="date"
                    value={
                        filters.createdAtTo ?? ""
                    }
                    onChange={(e) =>
                        handleFilterChange(
                            "createdAtTo",
                            e.target.value
                        )
                    }
                />

            </div>

            {tickets.length === 0 ? (

                <p>
                    {loading
                        ? "Cargando tickets..."
                        : "No hay tickets registrados."
                    }
                </p>

            ) : (

                <div
                    className={`${tableStyles.tableWrap} ${
                        loading
                            ? tableStyles.loading
                            : ""
                    }`}
                >

                    <table className={tableStyles.table}>

                        <thead>
                            <tr>

                                <th className={tableStyles.headCell}>
                                    ID
                                </th>

                                <th className={tableStyles.headCell}>
                                    Asunto
                                </th>

                                <th className={tableStyles.headCell}>
                                    Categoría
                                </th>

                                <th className={tableStyles.headCell}>
                                    Usuario
                                </th>

                                <th className={tableStyles.headCell}>
                                    Estado
                                </th>

                                <th className={tableStyles.headCell}>
                                    Creado
                                </th>

                                <th className={tableStyles.headCell}>
                                    Actualizado
                                </th>

                                <th className={tableStyles.headCell}>
                                    Acción
                                </th>

                            </tr>
                        </thead>

                        <tbody>

                            {tickets.map(ticket => (

                                <tr
                                    key={ticket.supportTicketId}
                                >

                                    <td>
                                        #{ticket.supportTicketId}
                                    </td>

                                    <td>
                                        {ticket.subject}
                                    </td>

                                    <td>
                                        {
                                            ticket.supportCategoryName
                                        }
                                    </td>

                                    <td>
                                        #{ticket.userId}
                                    </td>

                                    <td>

                                        <select
                                            className={
                                                tableStyles.statusSelect
                                            }
                                            value={
                                                pendingStatus[
                                                    ticket.supportTicketId
                                                ] ??
                                                ticket.supportTicketStatusId
                                            }
                                            onChange={(e) =>
                                                handleStatusChange(
                                                    ticket,
                                                    Number(
                                                        e.target.value
                                                    )
                                                )
                                            }
                                        >

                                            {statuses.map(
                                                status => (

                                                    <option
                                                        key={
                                                            status.supportTicketStatusId
                                                        }
                                                        value={
                                                            status.supportTicketStatusId
                                                        }
                                                    >
                                                        {
                                                            status.name
                                                        }
                                                    </option>

                                                )
                                            )}

                                        </select>

                                    </td>

                                    <td>
                                        {formatDate(
                                            ticket.createdAt
                                        )}
                                    </td>

                                    <td>
                                        {formatDate(
                                            ticket.updatedAt
                                        )}
                                    </td>

                                    <td>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleViewTicket(
                                                    ticket.supportTicketId
                                                )
                                            }
                                        >
                                            Ver ticket
                                        </button>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>
            )}

            {tickets.length > 0 &&
                totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onNextPage={onNextPage}
                        onPrevPage={onPrevPage}
                    />
                )}

        </div>
    );

}