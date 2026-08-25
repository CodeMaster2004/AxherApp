"use client";

import { ProblemReportResponse } from "@/entities/types/problemReport.types";
import ProblemReportCard from "@/features/reports/components/ProblemReportCard";
import Pagination from "@/shared/components/ui/Pagination";
import styles from "./ProblemReportList.module.css";
import { useTranslations } from "next-intl";

interface Props {
    reports: ProblemReportResponse[];
    loading: boolean;

    currentPage: number;
    totalPages: number;

    onNextPage: () => void; 
    onPrevPage: () => void;
}

export default function ProblemReportList({
    reports,
    loading,
    
    currentPage,
    totalPages,
    onNextPage,
    onPrevPage
}: Props) {

    const t = useTranslations("problemReport");

    return (

        <section className={styles.section}>
            <h2>{t("myReports")}</h2>

            {reports.length === 0 ? (
                <div className={styles.empty}>
                   {loading 
                        ? t("list.loading")
                        : t("list.empty")
                    } 
                </div>
            ) : (

                <div className={styles.list}>
                    {reports.map((report) => (
                        <ProblemReportCard
                            key={report.reportId}
                            report={report}
                        />
                    ))}
                </div>
            )}
            {reports.length > 0 && totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onNextPage={onNextPage}
                    onPrevPage={onPrevPage}
                />
            )}
        </section>
    )
}