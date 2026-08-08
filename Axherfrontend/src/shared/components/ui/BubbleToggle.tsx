"use client";

import styles from "@/shared/components/ui/BubbleToggle.module.css";

interface Props {
    checked:boolean;
    onChange:()=>void;
    disabled?:boolean;
}

export default function BubbleToggle({
    checked,
    onChange,
    disabled=false
}:Props){
    return (
        <label className={styles.label}>
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                disabled={disabled}
                className={`
                    ${styles.bubble}
                    ${checked ? styles.active : ""}
                    ${disabled ? styles.disabled : ""}
                
                `}
            />
        </label>
    )
}