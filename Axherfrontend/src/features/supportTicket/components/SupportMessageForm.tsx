"use client";

import Button from "@/shared/components/ui/Button";
import TextArea from "@/shared/components/ui/TextArea";
import styles from "./SupportMessageForm.module.css";
import formStyles from "@/shared/styles/shared/Form.module.css";

interface Props {
    message: string;
    setMessage: (value: string) => void;

    onSubmit: (
        e: React.FormEvent<HTMLFormElement>
    ) => void;

    saving?: boolean;
    error?: string;
}

export default function SupportMessageForm({
    message,
    setMessage,
    onSubmit,
    saving = false,
    error,
}: Props) {

    return (
        <form
            className={styles.form}
            onSubmit={onSubmit}
        >
            <h3 className={styles.title}>Enviar mensaje</h3>

            {error && (
                <p className={styles.errorMessage}>
                    {error}
                </p>
            )}

            <TextArea
                label="Mensaje"
                value={message}
                onChange={setMessage}
                placeholder="Escribe tu mensaje aquí..."
                rows={4}
                maxLength={2000}
                disabled={saving}
                required
            />

            <div className={styles.actions}>
                <Button
                    type="submit"
                    variant="animated"
                    loading={saving}
                    loadingText="Enviando..."
                >
                    Enviar mensaje
                </Button>
            </div>
        </form>
    );
}