"use client";

import { ShelfLayout, ShelfTarget } from "@/entities/types";
import BubbleToggle from "@/shared/components/ui/BubbleToggle";
import Button from "@/shared/components/ui/Button";
import Input from "@/shared/components/ui/Input";
import Select from "@/shared/components/ui/Select";
import { shelfLayoutOptions, shelfTargetOptions } from "@/shared/constants/selectOptions";
import styles from "@/shared/styles/shared/Form.module.css";

interface Props {
    name: string;
    target: ShelfTarget | undefined;
    layout: ShelfLayout | undefined;
    displayOrder: number;
    active: boolean;

    setName: (value: string) => void;
    setTarget: (value: ShelfTarget) => void;
    setLayout: (value: ShelfLayout) => void;
    setDisplayOrder: (value: number) => void;
    setActive: (value: boolean) => void;

    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;

    isEditing?: boolean;
    saving?: boolean;
    error?: string;

    onCancel?: () => void;
}

export default function ShelfForm({
    name,
    target,
    layout,
    displayOrder,
    active,

    setName,
    setTarget,
    setLayout,
    setDisplayOrder,
    setActive,

    onSubmit,

    isEditing = false,
    saving = false,
    error,

    onCancel
}: Props) {

    return (

        <form className={styles.form} onSubmit={onSubmit}>

            <h2>{isEditing ? 'Editar Carrusuel' : 'Crear Carrusel'}</h2>

            {error && (
                <p className={styles.errorMessage}>
                    {error}
                </p>
            )}

            <Input
                label="Nombre del Carrusel"
                value={name}
                onChange={setName}
                placeholder="Ej: Carrusel de Películas"
                required
                disabled={saving}
            />

            <Select
                label="Target del Carrusel"
                value={target}
                onChange={(value) => 
                    setTarget(value as ShelfTarget)
                }
                options={shelfTargetOptions}
                disabled={saving}
            />

            <Select
                label="Diseño de las tarjetas"
                value={layout}
                onChange={(value) =>
                    setLayout(value as ShelfLayout)
                }
                options={shelfLayoutOptions}
                disabled={saving}
            />

            <Input
                label="Orden de visualización"
                type="number"
                value={displayOrder.toString()}
                onChange={(value) => 
                    setDisplayOrder(Number(value))
                }
                min={0}
                disabled={saving}
            />

            <div className={styles.switchField}>

                <span>Activo</span>

                <BubbleToggle
                    checked={active}
                    onChange={() =>
                        setActive(!active)
                    }
                    disabled={saving}
                />

            </div>

            <div className={styles.formActions}>
                    
                <Button
                    type="submit"
                    variant="animated"
                    loading={saving}
                    loadingText={
                        isEditing ? 'Actualizando...' : 'Creando...'
                    }
                >
                    {isEditing ? 'Actualizar' : 'Crear'}
                    
                </Button>
                {
                    onCancel && (
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onCancel}
                            disabled={saving}
                        >
                            Cancelar
                        </Button>
                    )
                }
            </div>
        </form>
    )
}