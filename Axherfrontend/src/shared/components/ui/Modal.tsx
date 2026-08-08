"use client";

import styles from "./Modal.module.css";

interface Props {
    open: boolean;
    title: string;
    children: React.ReactNode;
    onClose: () => void;
    size?: "sm" | "md" | "lg" | "xl";
}


export default function Modal({
    open,
    title,
    children,
    onClose,
    size = "md"
}: Props) {


    if (!open) return null;


    return (

        <div
            className={styles.overlay}
            onMouseDown={onClose}
        >

            <div
                className={`${styles.modal} ${styles[size]}`}
                onMouseDown={(e)=>e.stopPropagation()}
            >

                <div className={styles.header}>

                    <h2>
                        {title}
                    </h2>


                    <button
                        type="button"
                        className={styles.close}
                        onClick={onClose}
                    >
                        ×
                    </button>

                </div>


                <div className={styles.body}>
                    {children}
                </div>


            </div>

        </div>

    );
}