"use client";

import styles from "./Rating.module.css";

interface RatingProps {
    id: string;
    value?: number;
    onChange?: (value: number) => void;
}

export default function Rating({
    id,
    value = 0,
    onChange,
}: RatingProps) {

    return (
        <div className={styles.rating}>

            {[1, 2, 3, 4, 5].map((star) => (

                <label
                    key={star}
                    className={`
                        ${styles.star}
                        ${star <= value ? styles.active : ""}
                    `}
                >
                    <input
                        type="radio"
                        name={id}
                        value={star}
                        checked={value === star}
                        onChange={() => onChange?.(star)}
                    />

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                    >
                        <path
                            pathLength="360"
                            d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"
                        />
                    </svg>

                </label>

            ))}

        </div>
    );
}