"use client";

import { HeroBanner } from "@/entities/types";
import { useState } from "react";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import tableStyles from "@/shared/styles/shared/Table.module.css";
import ConfirmDialog from "@/shared/components/ui/ConfirmDialog";
import Image from "next/image";
import MoreMenu from "@/shared/components/ui/MoreMenu";
import Pagination from "@/shared/components/ui/Pagination";
import BubbleToggle from "@/shared/components/ui/BubbleToggle";
import { useTranslations } from "next-intl";

interface Props {
    banners: HeroBanner[];
    onEdit:(banner:HeroBanner)=>void;
    onDelete:(id:number)=>void;
    

    onToggle:(id:number)=>void;

    deletingId?:number|null;
    togglingId?:number|null;
    loading?:boolean;

    currentPage:number;
    totalPages:number;
    onNextPage:()=>void;
    onPrevPage:()=>void;

    searchTerm:string;
    onSearchChange:(value:string)=>void;
    onTranslations?:(banner: HeroBanner)=>void;
}

export default function HeroBannerList({
    banners,

    onEdit,
    onDelete,
    onToggle,

    deletingId,
    togglingId,

    loading,

    currentPage,
    totalPages,

    onNextPage,
    onPrevPage,

    searchTerm,
    onSearchChange,
    onTranslations,

}: Props){

    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        id: 0,
        title: "",
    });

    const handleDeleteClick = (id: number, title: string) => {
        setConfirmDialog({
            isOpen: true,
            id,
            title,
        });
    }

    const handleConfirmDelete = () => {
        onDelete(confirmDialog.id);
        setConfirmDialog({
            isOpen: false,
            id: 0,
            title: "",
        });
    }

    const common = useTranslations("common");
    const t = useTranslations("heroBanner");
        
    return (

        <div className={layoutStyles.section}>

            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title={t("delete.title")}
                message={t("delete.message", { title: confirmDialog.title })}
                confirmText={common("delete")}
                cancelText={common("cancel")}
                variant="danger"
                onConfirm={handleConfirmDelete}
                onCancel={() => setConfirmDialog({ isOpen: false, id: 0, title: "" })}
            />

            <div className={tableStyles.searchBox}>
                <input
                    type="text"
                    placeholder={t("list.searchPlaceholder")}
                    value={searchTerm}
                    onChange={(e)=>onSearchChange(e.target.value)}
                    className={tableStyles.searchInput}
                />

            </div>
            {
                banners.length === 0 ? (
                    <p>
                        {
                            loading
                            ? t("list.loading")
                            : t("list.empty")
                        }
                    </p>
                ):(
                    <div className={tableStyles.tableWrap}>
                        <table className={tableStyles.table}>
                            <thead>
                                <tr>
                                    <th className={`${tableStyles.headCell} ${tableStyles.idColum}`}>{common("id")}</th>
                                    <th className={`${tableStyles.headCell} ${tableStyles.backdropColum}`}>{t("list.image")}</th>
                                    <th className={`${tableStyles.headCell} ${tableStyles.contentColum}`}>{t("list.content")}</th>
                                    <th className={`${tableStyles.headCell} ${tableStyles.priorityColum}`}>{t("list.priority")}</th>
                                    <th className={`${tableStyles.headCell} ${tableStyles.iniciColum}`}>{t("list.startDate")}</th>
                                    <th className={`${tableStyles.headCell} ${tableStyles.finColum}`}>{t("list.endDate")}</th>
                                    <th className={`${tableStyles.headCell} ${tableStyles.estadoColum}`}>{t("list.status")}</th>
                                    <th className={tableStyles.actionsColumn}>{common("actions")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    banners.map((banner) => (
                                        <tr key={banner.heroBannerId}>

                                            <td>{banner.heroBannerId}</td>
                                            <td>
                                                {
                                                    banner.backdropUrl ?
                                                    <Image
                                                        src={banner.backdropUrl}
                                                        alt={banner.titleOverride || banner.contentTitle || t("title")}
                                                        width={180}
                                                        height={100}
                                                        style={{objectFit:"cover"}}
                                                    />
                                                    :
                                                    "-"
                                                }
                                            </td>
                                            <td>
                                                <strong>
                                                {banner.contentTitle}
                                                </strong>
                                                <br/>
                                                {
                                                    banner.titleOverride && (
                                                        <small>
                                                            {banner.titleOverride}
                                                        </small>
                                                    )
                                                }
                                            </td>
                                            <td>{banner.priority}</td>
                                            <td>{banner.startDate ?? "-"}</td>
                                            <td>{banner.endDate ?? "-"}</td>
                                            <td>

                                                <BubbleToggle
                                                    checked={banner.active}
                                                    onChange={()=>onToggle(banner.heroBannerId)}
                                                    disabled={togglingId === banner.heroBannerId}
                                                />

                                            </td>
                                            <td>
                                                <MoreMenu
                                                    items={[
                                                        {
                                                            label: common("edit"),
                                                            onClick: () => onEdit(banner),
                                                        },
                                                        ...(onTranslations ? [{
                                                            label: t("list.translations"),
                                                            onClick: () => onTranslations(banner),
                                                        }] : []),
                                                        {
                                                            label:
                                                            deletingId === banner.heroBannerId
                                                                ? common("deleting")
                                                                : common("delete"),
                                                                variant: "danger",

                                                                onClick:() => handleDeleteClick(
                                                                    banner.heroBannerId,
                                                                    banner.contentTitle
                                                                )
                                                        }
                                                    ]}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                )
            }
            {
                banners.length > 0 && totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onNextPage={onNextPage}
                        onPrevPage={onPrevPage}
                    />
                )
            }
        </div>
    )
}