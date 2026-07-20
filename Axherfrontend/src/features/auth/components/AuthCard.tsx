import { FormEvent, ReactNode } from "react";
import styles from "./AuthCard.module.css";

interface Props {
  title: string;
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
}

export default function AuthCard({ title, onSubmit, children }: Props) {
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <p className={styles.heading}>{title}</p>
      {children}
    </form>
  );
}