"use client"
import styles from "@/shared/styles/shared/Pagination.module.css";
import Button from "@/shared/components/ui/Button";

type PaginationProps = {
    currentPage: number,
    totalPages: number,
    onPrevPage: () => void,
    onNextPage: () => void,
    onGoToPage?: (page: number) => void;
};


export default function Pagination({
    currentPage,
    totalPages,
    onPrevPage,
    onNextPage,
    onGoToPage,

}: PaginationProps){
    const isFirstPage = currentPage === 0;
    const isLastPage = currentPage === totalPages - 1;

    return(
        <div className={styles.container}>
            {/*Boton Anterior*/}
            <Button
                variant="secondary"
                onClick={onPrevPage}
                disabled={isFirstPage}
                >
                    ← Anterior
            </Button>
            {/*Info de pagina*/ }
            <span className={styles.info}>
                pagina {currentPage + 1} de {totalPages}
            </span>

            {/*Boton Siguiente*/}
            <Button
                variant="secondary"
                onClick={onNextPage}
                disabled={isLastPage}
                >
                    Siguiente →
            </Button>

        </div>
    )

}