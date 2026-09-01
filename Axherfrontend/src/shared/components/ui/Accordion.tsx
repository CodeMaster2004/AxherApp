"use client";

import { ReactNode, useState } from "react";
import styles from "./Accordion.module.css";

interface AccordionProps {
    title: ReactNode;
    children: ReactNode;
    defaultOpen?: boolean;
}

export default function Accordion({
    title,
    children,
    defaultOpen = false,
}: AccordionProps) {

    const [open, setOpen] = useState(defaultOpen);

    return (

        <div
            className={`${styles.item} ${open ? styles.open : ""}`}
        >
            <button
                type="button"
                className={styles.trigger}
                onClick={() => setOpen(prev => !prev)}
                aria-expanded={open}
            >
                <span className={styles.title}>
                    {title}
                </span>
                <span
                    className={styles.icon}
                    aria-hidden="true"
                >
                    +
                </span>
            </button>
            <div
                className={styles.contentWrapper}
                aria-hidden={!open}
            >
                <div
                    className={styles.content}
                >
                    {children}
                </div>
            </div>
        </div>
    )
}