"use client";

import { LanguageResponse, SupportTicketStatusRequest } from "@/entities/types";
import Button from "@/shared/components/ui/Button";
import Input from "@/shared/components/ui/Input";
import Select, { SelectOption } from "@/shared/components/ui/Select";
import TextArea from "@/shared/components/ui/TextArea";
import styles from "@/shared/styles/shared/Form.module.css";
import { useTranslations } from "next-intl";

interface Props {
    value: SupportTicketStatusRequest;
    onChange: React.Dispatch<
        React.SetStateAction<SupportTicketStatusRequest>>;
    languages: LanguageResponse[];
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    isEditing: boolean;
    onCancel?: () => void;
    saving?: boolean;
    error?: string;
}

export default function SupportTicketStatusForm({
    value,
    onChange,
    languages,
    onSubmit,
    isEditing,
    onCancel,
    saving = false,
    error,
}: Props) {

    const t = useTranslations("common");
    
    const languageOptions: SelectOption[] = languages.map(language => ({
        value: language.languageId,
        label: `${language.name} (${language.nativeName})`, 
    }));
    return (

        <form onSubmit={onSubmit} className={styles.form}>
            <h2>{isEditing ? 'Editar Estado del ticket' : 'Crear Estado del ticket'}</h2>

            {error && (
                <p className={styles.errorMessage}>
                {error}
                </p>
            )}

            <Input
                label="Código del Estado del ticket"
                value={value.code}
                onChange={(code) => onChange(prev => ({ ...prev, code, })) }
                placeholder="Ej: PENDING"
                maxLength={20}
                required
                disabled={saving}
                autoFocus={!isEditing}
            />

            <Select
                label="Idioma"
                options={languageOptions}
                value={value.languageId ?? ""}
                onChange={(languageId) =>
                    onChange(prev => ({
                        ...prev,
                        languageId: Number(languageId),
                    }))
                }
                placeholder="Selecciona un idioma"
                disabled={saving || isEditing}
            />

            <Input
                label="Nombre del Estado del ticket"
                value={value.name}
                onChange={(name) => onChange(prev => ({ ...prev, name, })) }
                placeholder="Ej: Pendiente"
                maxLength={50}
                required
                disabled={saving}
                autoFocus={isEditing}
            />

            <TextArea
                label="Descripción"
                value={value.description}
                onChange={(description) => onChange(prev => ({ ...prev, description, }))}
                placeholder="Descripción del estado de reporte"
                rows={4}
                disabled={saving}
            />

            <div className={styles.formActions}>

                <Button
                    type="submit"
                    variant="animated"
                    loading={saving}
                    loadingText={isEditing ? 'Actualizando...' : 'Creando...'}
                >
                    {isEditing ? 'Actualizar' : t("create")}
                </Button>
                {onCancel && (
                    <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                    disabled={saving}
                    >
                    {t("cancel")}
                    </Button>
                )}

            </div>

        </form>
    )
}