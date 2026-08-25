"use client";

import { ProblemReportResponse } from "@/entities/types/problemReport.types";
import styles from "./ProblemReportCard.module.css";
import { formatDate } from "@/shared/utils/date";
import { useTranslations } from "next-intl";

interface Props {
    report: ProblemReportResponse;
}

export default function ProblemReportCard({ report }: Props) {

    const t = useTranslations("problemReport");

    return (
        <article className={styles.card}>

            <div className={styles.header}>

                <div className={styles.heading}>
                    <span className={styles.category}>
                        {report.category}
                    </span>

                    <span className={styles.reportId}>
                        {t("report")} #{report.reportId}
                    </span>
                </div>

                <span className={styles.status}>
                    {report.reportStatusName}
                </span>

            </div>

            <div className={styles.content}>
                <p className={styles.description}>
                    {report.description}
                </p>
            </div>

            <div className={styles.footer}>

                <div className={styles.date}>
                    <span className={styles.dateLabel}>
                        {t("list.reported")}
                    </span>

                    <span>
                        {formatDate(report.reportedAt)}
                    </span>
                </div>

                {report.resolvedAt && (
                    <div className={styles.date}>
                        <span className={styles.dateLabel}>
                            {t("list.resolved")}
                        </span>

                        <span>
                            {formatDate(report.resolvedAt)}
                        </span>
                    </div>
                )}

            </div>

        </article>
    );
}
