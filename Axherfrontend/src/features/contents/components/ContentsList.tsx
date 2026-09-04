"use client";

import { ContentDetail, ContentStatusResponse, ContentType } from "@/entities/types";
import Pagination from "@/shared/components/ui/Pagination";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import tableStyles from "@/shared/styles/shared/Table.module.css";
import Image from "next/image";
import { useState } from "react";
import ConfirmDialog from "../../../shared/components/ui/ConfirmDialog";
import MoreMenu from "../../../shared/components/ui/MoreMenu";
import { useLocale, useTranslations } from "next-intl";
import { formatDate } from "@/shared/utils/date";
interface Props{
    contents: ContentDetail[];
    statuses: ContentStatusResponse[];

    onDelete: (id: number) => void;
    onEdit: (content: ContentDetail) => void;
    onUpdateStatus: (id: number, statusId: number) => void;
    
    onView?: (content: ContentDetail) => void;
    onViewSeasons?: (content: ContentDetail) => void;
    onCreateSeason?: (content: ContentDetail) => void;
    deletingId?: number | null;
    loading?: boolean;

    currentPage: number;
    totalPages: number;
    onNextPage: () => void;
    onPrevPage: () => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;
    onTranslations?: (content: ContentDetail) => void;
    onManagePeople?: (content: ContentDetail) => void;
}

export default function ContentsList({
    contents,
    statuses,
    onDelete,
    onEdit,
    onUpdateStatus,
    onView,
    onViewSeasons,
    onCreateSeason,
    deletingId,
    loading,
    currentPage,
    totalPages,
    onNextPage,
    onPrevPage,
    searchTerm,
    onSearchChange,
    onTranslations,
    onManagePeople,
}: Props){
    const [pendingStatus, setPendingStatus] = useState<Record<number,number>>({});
    const locale = useLocale();
    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        id: number;
        title: string;
    }>({
        isOpen: false,
        id: 0,
        title: "",
    });

    const [statusDialog, setStatusDialog] = useState<{
        isOpen: boolean;
        contentId: number;
        statusId: number;
        statusName: string;
        contentTitle: string;
    }>({
        isOpen: false,
        contentId: 0,
        statusId: 0,
        statusName: "",
        contentTitle: "",
    });


    const handleDeleteClick = (id: number, title: string) => {
        setConfirmDialog({ isOpen: true, id, title});
    };

    const handleConfirmDelete = () => {
        onDelete(confirmDialog.id);
        setConfirmDialog({ isOpen: false, id: 0, title: ""});
    };

    const handleCancelDelete = () => {
        setConfirmDialog({ isOpen: false, id: 0, title: ""});
    };

    const handleConfirmStatus = () => {

        onUpdateStatus(
            statusDialog.contentId,
            statusDialog.statusId
        );

        setPendingStatus(prev => {
            const copy = {...prev};
            delete copy[statusDialog.contentId];
            return copy;
        });

        handleCancelStatus();
    };

    const common = useTranslations("common");
    const t = useTranslations("contents");

    const handleCancelStatus = () => {

        setPendingStatus(prev => {
            const copy = {...prev};
            delete copy[statusDialog.contentId];
            return copy;
        });

        setStatusDialog({
            isOpen:false,
            contentId:0,
            statusId:0,
            statusName:"",
            contentTitle:""
        });
    };
    

    return (
        <div className={layoutStyles.section}>
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title={t("delete.title")}
                message={t("delete.message", {title: confirmDialog.title})}
                confirmText={common("delete")}
                cancelText={common("cancel")}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                variant="danger"
            />
            <ConfirmDialog
                isOpen={statusDialog.isOpen}
                title={t("status.changeTitle")}
                message={t("status.changeMessage", {title: statusDialog.contentTitle, status: statusDialog.statusName})}
                confirmText={common("change")}
                cancelText={common("cancel")}
                onConfirm={handleConfirmStatus}
                onCancel={handleCancelStatus}
                variant="info"
            />

            <div className={tableStyles.searchBox}>
                <input
                    type="text"
                    placeholder={t("list.searchPlaceholder")}
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className={tableStyles.searchInput}
                />

            </div>

            {contents.length === 0 ? (
                <p>{loading ? common("searching") : t("list.empty")}</p>
            ) : (
                <div className={`${tableStyles.tableWrap} ${loading ? tableStyles.loading : ""}`}>

                    <table className={tableStyles.table}>
                        <thead>
                            <tr className={tableStyles.rowHover}>
                                <th className={`${tableStyles.headCell} ${tableStyles.idColum}`}>{common("id")}</th>
                                <th className={`${tableStyles.headCell} ${tableStyles.posterColumn}`}>{t("list.poster")}</th>
                                <th className={`${tableStyles.headCell} ${tableStyles.titleColumn}`}>{common("title")}</th>
                                <th className={`${tableStyles.headCell} ${tableStyles.typeColumn}`}>{t("list.type")}</th>
                                <th className={`${tableStyles.headCell} ${tableStyles.priceColumn}`}>{t("list.price")}</th>
                                <th className={`${tableStyles.headCell} ${tableStyles.categoriesColumn}`}>{t("list.categories")}</th>
                                <th className={`${tableStyles.headCell} ${tableStyles.statusColumn}`}>{common("status")}</th>
                                <th className={`${tableStyles.headCell} ${tableStyles.discountColumn}`}>{t("list.discount")}</th>
                                <th className={`${tableStyles.headCell} ${tableStyles.registeredAtcolumn}`}>{t("list.registeredAt")}</th>
                                <th className={tableStyles.actionsColumn}>{common("actions")}</th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            {contents.map((content) => (
                                <tr key={content.contentId}>
                                    <td>{content.contentId}</td>

                                    <td>
                                        {content.posterUrl ? (
                                            <Image 
                                                src={content.posterUrl}
                                                alt={content.title}
                                                width={100}
                                                height={150}
                                                style={{objectFit: "cover"}}
                                            />
                                        ) : (
                                            "-"
                                        )}
                                    </td>

                                    <td>{content.title}</td>

                                    <td>
                                        <span className={content.type === "SERIE" ? tableStyles.badgeSeries : tableStyles.badgeMovie}>
                                            {content.type === "SERIE" ? t("list.series") : t("list.movie")}
                                        </span>
                                    </td>

                                    <td>S/ {content.price.toFixed(2)}</td>

                                    <td className={tableStyles.categoriesCell}>{content.categories.join(", ")}</td>
                                    <td>
                                        <select
                                            className={tableStyles.statusSelect}
                                            value={
                                                pendingStatus[content.contentId] ?? content.status.contentStatusId
                                            }
                                            onChange={(e)=>{
                                            const statusId = Number(e.target.value);

                                            const selectedStatus = statuses.find(
                                                status => status.contentStatusId === statusId
                                            );

                                            setPendingStatus(prev => ({
                                                ...prev,
                                                [content.contentId]: statusId
                                            }));

                                            setStatusDialog({
                                                isOpen: true,
                                                contentId: content.contentId,
                                                statusId,
                                                statusName: selectedStatus?.name ?? "",
                                                contentTitle: content.title
                                            });
                                        }}
                                        >
                                            {
                                                statuses.map((status)=>(
                                                    <option
                                                        key={status.contentStatusId}
                                                        value={status.contentStatusId}
                                                    >
                                                        {status.name}
                                                    </option>
                                                ))
                                            }
                                        </select>
                                    </td>
                                    <td>{content.discountAmount ? `${content.discountAmount}%` : t("list.noDiscount")}</td>

                                    <td>{formatDate(content.registeredAt, locale)}</td>

                                    <td>
                                        <MoreMenu
                                            items={[
                                                ...(content.type === ContentType.SERIE && onViewSeasons
                                                    ? [{
                                                        label: t("actions.viewSeasons"),
                                                        onClick: () => onViewSeasons(content),
                                                    }]
                                                    : []),

                                                ...(content.type === ContentType.SERIE && onCreateSeason
                                                    ? [{
                                                        label: t("actions.createSeason"),
                                                        onClick: () => onCreateSeason(content),
                                                    }]
                                                    : []),

                                                ...(onManagePeople
                                                    ? [{
                                                        label: t("actions.managePeople"),
                                                        onClick: () => onManagePeople(content),
                                                    }]
                                                    : []),

                                                {
                                                    label: common("edit"),
                                                    onClick: () => onEdit(content),
                                                },

                                                ...(onTranslations
                                                    ? [{
                                                        label: t("actions.translations"),
                                                        onClick: () => onTranslations(content),
                                                    }]
                                                    : []),

                                                {
                                                    label:
                                                        deletingId === content.contentId
                                                            ? common("deleting")
                                                            : common("delete"),
                                                    onClick: () =>
                                                        handleDeleteClick(
                                                            content.contentId,
                                                            content.title
                                                        ),
                                                    variant: "danger",
                                                },
                                            ]}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>


                </div>
            )}

            {contents.length > 0 && totalPages > 1 && (
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