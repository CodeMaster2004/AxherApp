"use client";

import Button from "@/shared/components/ui/Button";
import TextArea from "@/shared/components/ui/TextArea";
import styles from "@/shared/styles/shared/Form.module.css";
interface SupportCategoryOption {
    supportCategoryId: number;
    name: string;
}

interface Props {
    subject: string;
    setSubject: (value: string) => void;

    supportCategoryId: number | "";
    setSupportCategoryId: (value: number | "") => void;

    description: string;
    setDescription: (value: string) => void;

    categories: SupportCategoryOption[];

    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;

    saving?: boolean;
    error?: string;
    onCancel?: () => void;
}

export default function SupportTicketForm({
    subject,
    setSubject,
    supportCategoryId,
    setSupportCategoryId,
    description,
    setDescription,
    categories,
    onSubmit,
    saving = false,
    error,
    onCancel
}: Props) {

    return (
        <form onSubmit={onSubmit} className={styles.form}>
            <h2>Contactar con soporte</h2>

            {error && (
                <p className={styles.errorMessage}>
                    {error}
                </p>
            )}

            <div className={styles.field}>
                <label htmlFor="support-ticket-subject">
                    Asunto
                </label>

                <input
                    id="support-ticket-subject"
                    className={styles.input}
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="¿En que necesitas ayuda?"
                    maxLength={150}
                    disabled={saving}
                    required
                />

            </div>
            <div className={styles.field}>
                <label htmlFor="support-ticket-category">
                    Categoria
                </label>

                <select
                    id="support-ticket-category"
                    className={styles.select}
                    value={supportCategoryId}
                    onChange={(e) =>
                        setSupportCategoryId(
                            e.target.value
                                ? Number(e.target.value)
                                : ""
                        )
                    }
                    disabled={saving}
                    required
                >
                    <option value="">
                        Selecciona una categoria
                    </option>
                    {categories.map((category) => (

                        <option
                            key={category.supportCategoryId}
                            value={category.supportCategoryId}
                        >
                            {category.name}
                        </option>
                    ))}

                </select>

            </div>

            <TextArea
                label="Describe tu problema"
                value={description}
                onChange={setDescription}
                placeholder="Cuéntanos que ocurrio y cómo podemos ayudarte..."
                rows={6}
                maxLength={2000}
                disabled={saving}
                required
            />

            <div>
                <Button
                    type="submit"
                    variant="animated"
                    loading={saving}
                    loadingText="Creando ticket..."
                >
                    Crear ticket
                </Button>
                {onCancel && (
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onCancel}
                        disabled={saving}
                    >
                        Cancelar
                    </Button>
                )}
            </div>
        </form>
    )
}