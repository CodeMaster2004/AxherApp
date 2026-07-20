"use client";

import type { SyntheticEvent } from "react";
import formStyles from "@/shared/styles/shared/Form.module.css";
import Input from "@/shared/components/ui/Input";
import Button from "@/shared/components/ui/Button";

interface Props {
    roleName: string;
    setRoleName: (value: string) => void;
    onSubmit: (e: SyntheticEvent<HTMLFormElement>) => void;
    isEditing: boolean;
    onCancel?: () => void;
    saving?: boolean;
}

export default function SystemRolesForm({
    roleName,
    setRoleName,
    onSubmit,
    isEditing,
    onCancel,
    saving = false,
}: Props) {

    return (

        <form onSubmit={onSubmit} className={formStyles.form}>
            <h2>{isEditing ? 'Editar Rol' : 'Crear Rol'}</h2>

            <Input
                label="Nombre del Rol"
                value={roleName}
                onChange={setRoleName}
                placeholder="Ej. MODERADOR"
                required
                disabled={saving}
                autoFocus={!isEditing}
            />
            <div className={formStyles.formActions}>
                <Button
                    type="submit"
                    variant="animated"
                    disabled={saving}
                    loadingText={isEditing ? 'Actualizando...' : ' Creando...'}
                >
                    {isEditing ? 'Actualizar' : 'Crear'}
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