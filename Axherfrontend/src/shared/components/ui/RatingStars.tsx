"use client";

import styles from "./RatingStars.module.css";

type RatingStarsProps = {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  max?: number;
  name?: string;
};

export default function RatingStars({
  value,
  onChange,
  readOnly = false,
  max = 5,
  name = "rating",
}: RatingStarsProps) {
  return (
    <div className={styles.rating} aria-label={`Calificación de ${value} de ${max}`}>
      {Array.from({ length: max }, (_, index) => {
        const starValue = index + 1;
        const id = `${name}-${starValue}`;

        return (
          <div key={id} className={styles.item}>
            <input
              className={styles.input}
              type="radio"
              id={id}
              name={name}
              value={starValue}
              checked={value === starValue}
              disabled={readOnly}
              onChange={() => onChange?.(starValue)}
            />
            <label className={styles.label} htmlFor={id}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  pathLength="360"
                  d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"
                />
              </svg>
            </label>
          </div>
        );
      })}
    </div>
  );
}