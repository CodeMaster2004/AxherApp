"use client";

import styles from "@/shared/styles/shared/Pagination.module.css";

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    onPrevPage: () => void;
    onNextPage: () => void;
    onGoToPage?: (page: number) => void;
};

export default function Pagination({
    currentPage,
    totalPages,
    onPrevPage,
    onNextPage,
    onGoToPage,
}: PaginationProps) {

    if (totalPages <= 1) {
        return null;
    }

    const pages: (number | "...")[] = [];

    if (totalPages <= 7) {

        for (let i = 0; i < totalPages; i++) {
            pages.push(i);
        }

    } else {

        pages.push(0);

        if (currentPage > 3) {
            pages.push("...");
        }

        const start = Math.max(1, currentPage - 1);
        const end = Math.min(totalPages - 2, currentPage + 1);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (currentPage < totalPages - 4) {
            pages.push("...");
        }

        pages.push(totalPages - 1);
    }

    return (
        <nav
            className={styles.container}
            aria-label="Paginación"
        >

            <button
                type="button"
                className={styles.arrow}
                onClick={onPrevPage}
                disabled={currentPage === 0}
                aria-label="Página anterior"
            >
                ‹
            </button>

            <div className={styles.pages}>

                {pages.map((page, index) => {

                    if (page === "...") {
                        return (
                            <span
                                key={`ellipsis-${index}`}
                                className={styles.ellipsis}
                            >
                                …
                            </span>
                        );
                    }

                    const isActive = page === currentPage;

                    return (
                        <button
                            key={page}
                            type="button"
                            className={`${styles.page} ${
                                isActive ? styles.active : ""
                            }`}
                            onClick={() => onGoToPage?.(page)}
                            disabled={isActive}
                            aria-current={isActive ? "page" : undefined}
                        >
                            {page + 1}
                        </button>
                    );
                })}

            </div>

            <button
                type="button"
                className={styles.arrow}
                onClick={onNextPage}
                disabled={currentPage === totalPages - 1}
                aria-label="Página siguiente"
            >
                ›
            </button>

        </nav>
    );
}