"use client";

import formStyles from "@/shared/styles/shared/Form.module.css";
import Input from '@/shared/components/ui/Input';
import Button from '@/shared/components/ui/Button';

interface Props {
    contentStatus: string;
    setContentStatus: (value: string) => void;
    description: string;
    setDescription: (value: string) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    isEditing: boolean;
    onCancel?: () => void;
    saving?: boolean;
    error?: string;
}

export default function ContentStatusForm({
    contentStatus,
    setContentStatus,
    description,
    setDescription,
    onSubmit,
    isEditing,
    onCancel,
    saving = false,
    error,
}: Props) {
    return (
        <form onSubmit={onSubmit} className={formStyles.form}>
            <h2>{isEditing ? 'Editar Estado' : 'Crear Estado de Película'}</h2>
            {/* ERROR */}
            {error && (
                <p className={formStyles.errorMessage}>
                {error}
                </p>
            )}
            <Input 
                label="Estado de la Película"
                value={contentStatus}
                onChange={setContentStatus}
                placeholder="Ej: Disponible, No disponible, Próximamente"
                maxLength={20}
                required
                disabled={saving}
                autoFocus={!isEditing}
            />

            <Input
                label="Descripción (opcional)"
                value={description}
                onChange={setDescription}
                placeholder="Ej: Película disponible en cartelera"
                required={false} // opcional
                disabled={saving}
            />


            <div className={formStyles.formActions}>
                <Button 
                    type="submit" 
                    variant="animated" 
                    loading={saving} 
                    loadingText={isEditing ? 'Actualizando...' : 'Creando...'}
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
    );
}