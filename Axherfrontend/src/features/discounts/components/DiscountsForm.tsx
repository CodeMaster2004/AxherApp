"use client";

import formStyles from "@/shared/styles/shared/Form.module.css";
import Input from "../../../shared/components/ui/Input";
import TextArea from "../../../shared/components/ui/TextArea";
import Button from "../../../shared/components/ui/Button";

interface Props{
    discountType: string;
    amount: number;
    startDate: string; // formato "YYYY-MM-DD"
    endDate: string;   // formato "YYYY-MM-DD"
    description: string,

    setDiscountType: (value: string) => void;
    setAmount: (value: number) => void;
    setStartDate: (value: string) => void;
    setEndDate: (value: string) => void;
    setDescription: (value: string) => void;

    onSubmit: (e: React.FormEvent) => void;
    isEditing: boolean;
    onCancel?: () => void;
    saving?: boolean;
}

export default function DiscountsForm({
    discountType,
    amount,
    startDate,
    endDate,
    description,
    setDiscountType,
    setAmount,
    setStartDate,
    setEndDate,
    setDescription,
    onSubmit,
    isEditing,
    onCancel,
    saving = false,
}: Props) {
    
    return(
        <form onSubmit={onSubmit} className={formStyles.form}>
            <h2>{isEditing ? 'Editar Descuento' : 'Crear Descuento'}</h2>

            <Input
                label="Tipo de Descuento"
                value={discountType}
                onChange={setDiscountType}
                placeholder="Ej: Promocion de verano"
                required
                disabled={saving}
                autoFocus={!isEditing}
            />

            <Input
                label="Porcentaje de Descuento (%)"
                type="number"
                value={String(amount)}
                onChange={(val) => setAmount(val === "" ? 0 : Math.min(100, Math.max(0, Number(val))))}
                required
                disabled={saving}
                min={0}
                max={100}
            />

            <Input
                label="Fecha de Inicio"
                type="date"
                value={startDate}
                onChange={setStartDate}
                required
                disabled={saving}
            />

            <Input
                label="Fecha de Fin"
                type="date"
                value={endDate}
                onChange={setEndDate}
                required
                disabled={saving}
            />

            <TextArea
                label="Descripción"
                value={description}
                onChange={setDescription}
                placeholder="Descripcion del descuento"
                rows={4}
                required
                disabled={saving}
            />

            <div className={formStyles.formActions}>
                <Button
                    type="submit"
                    variant="animated"
                    disabled={saving}
                    loadingText={isEditing ? 'Actualizando...' : 'creando...'}
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