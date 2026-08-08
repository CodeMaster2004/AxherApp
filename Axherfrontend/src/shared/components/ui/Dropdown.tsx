"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import styles from "./Dropdown.module.css";
import { DropdownProps } from "@/shared/components/ui/types";

export default function Dropdown<T>({
    items,
    value,
    placeholder = "Seleccionar",
    disabled = false,
    className,
    width = 220,

    getValue,
    getLabel,

    onChange,

}: DropdownProps<T>) {

    const [open, setOpen] = useState(false);

    const rootRef = useRef<HTMLDivElement>(null);

    const selected = useMemo(() => {

        if (!value) return undefined;

        return items.find(

            item =>

                getValue(item) === getValue(value)

        );

    }, [items, value]);

    useEffect(() => {

        function handleClick(event: MouseEvent) {

            if (

                rootRef.current &&

                !rootRef.current.contains(event.target as Node)

            ) {

                setOpen(false);

            }

        }

        document.addEventListener("mousedown", handleClick);

        return () =>
            document.removeEventListener(
                "mousedown",
                handleClick
            );

    }, []);

    return (

        <div
            ref={rootRef}
            className={`${styles.dropdown} ${className ?? ""}`}
            style={{ width }}
        >

            <button
                type="button"
                disabled={disabled}
                className={styles.trigger}
                onClick={() => setOpen(prev => !prev)}
            >

                <span>

                    {selected
                        ? getLabel(selected)
                        : placeholder}

                </span>

                <ChevronDown
                    size={18}
                    className={`${styles.icon} ${
                        open ? styles.rotate : ""
                    }`}
                />

            </button>

            {open && (

                <div className={styles.menu}>

                    {items.map(item => {

                        const active =
                            value &&
                            getValue(item) === getValue(value);

                        return (

                            <button
                                key={getValue(item)}
                                type="button"
                                className={`${styles.item} ${
                                    active
                                        ? styles.active
                                        : ""
                                }`}
                                onClick={() => {

                                    onChange(item);

                                    setOpen(false);

                                }}
                            >

                                <span>

                                    {getLabel(item)}

                                </span>

                                {active &&

                                    <Check size={16} />

                                }

                            </button>

                        );

                    })}

                </div>

            )}

        </div>

    );

}