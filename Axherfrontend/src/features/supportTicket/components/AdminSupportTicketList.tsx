"use client";

import { SupportTicketFilters, SupportTicketResponse } from "@/entities/types";
import Pagination from "@/shared/components/ui/Pagination";
import { formatDate } from "@/shared/utils/date";
import { useRouter } from "next/navigation";
import { useState } from "react";
import tableStyles from "@/shared/styles/shared/Table.module.css"
import layoutStyles from "@/shared/styles/layout/Layout.module.css"
import ConfirmDialog from "@/shared/components/ui/ConfirmDialog";
import { useTranslations } from "next-intl";

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
    const common = useTranslations("common");
    const t = useTranslations("supportTickets");
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
                title={t("status.change")}
                message={t("status.confirmMessage", {
                    ticketId: statusDialog.ticketId,
                    statusName: statusDialog.statusName,
                })}
                confirmText={t("status.confirm")}
                cancelText={common("cancel")}
                onConfirm={handleConfirmStatus}
                onCancel={handleCancelStatus}
                variant="info"
            />

            <h2>{t("list.title")}</h2>

            <div className={tableStyles.searchBox}>

                <input
                    type="text"
                    placeholder={t("list.searchPlaceholder")}
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
                        {t("list.statusPlaceholder")}
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
                        {t("list.categoryPlaceholder")}
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
                    placeholder={t("list.userPlaceholder")}
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
                        ? t("loading")
                        : t("list.empty")
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
                                    {common("id")}
                                </th>

                                <th className={tableStyles.headCell}>
                                    {t("list.subject")}
                                </th>

                                <th className={tableStyles.headCell}>
                                    {t("list.category")}
                                </th>

                                <th className={tableStyles.headCell}>
                                    {t("list.user")}
                                </th>

                                <th className={tableStyles.headCell}>
                                    {t("list.status")}
                                </th>

                                <th className={tableStyles.headCell}>
                                    {t("list.created")}
                                </th>

                                <th className={tableStyles.headCell}>
                                    {t("list.updated")}
                                </th>

                                <th className={tableStyles.headCell}>
                                    {t("list.action")}
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
                                            {t("list.viewTicket")}
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