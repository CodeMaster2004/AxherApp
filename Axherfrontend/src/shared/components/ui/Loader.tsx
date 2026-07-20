// src/components/ui/Loader.tsx
"use client";
import styles from "./Loader.module.css";

export default function Loader() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.ring}></div>
        <div className={styles.ring}></div>
        <div className={styles.ring}></div>
        <div className={styles.ring}></div>
        <div className={styles.h3}>loading</div>
      </div>
    </div>
  );
}