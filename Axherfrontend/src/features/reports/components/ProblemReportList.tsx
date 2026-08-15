"use client";

import { ProblemReportResponse } from "@/entities/types/problemReport.types";
import ProblemReportCard from "@/features/reports/components/ProblemReportCard";
import Pagination from "@/shared/components/ui/Pagination";
import styles from "./ProblemReportList.module.css";

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

    return (

        <section className={styles.section}>
            <h2>Mis reportes</h2>

            {reports.length === 0 ? (
                <div className={styles.empty}>
                   {loading 
                        ? "Cargando reportes..." 
                        : "No hay reportes registrados." 
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