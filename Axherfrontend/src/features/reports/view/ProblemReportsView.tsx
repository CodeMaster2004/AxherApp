"use client"

import ProblemReportList from "@/features/reports/components/ProblemReportList";
import { useProblemReports } from "@/features/reports/hooks/useProblemReports";
import styles from "./ProblemReportsView.module.css";

export default function ProblemReportsView() {

    const {
        reports,
        loading,

        currentPage,
        totalPages,

        nextPage,
        prevPage
    } = useProblemReports();

    return (

        <div className={styles.view}>
            <ProblemReportList
                reports={reports}
                loading={loading}
                currentPage={currentPage}
                totalPages={totalPages}
                onNextPage={nextPage}
                onPrevPage={prevPage}
            />
        </div>
    )
}