import styles from "./ProgressBar.module.css";

interface ProgressBarProps {
  progress: number;
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  if (progress <= 0 || progress >= 100) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <h3>Subiendo película...</h3>

        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className={styles.progressText}>{progress}%</span>
      </div>
    </div>
  );
}