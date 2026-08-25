import { SyntheticEvent } from "react";
import Input from "@/shared/components/ui/Input";
import formStyles from "@/shared/styles/shared/Form.module.css";
import Button from "@/shared/components/ui/Button";
import { useTranslations } from "next-intl";

interface Props {
    moduleName: string;
    setModuleName: (value: string) => void;
    actionName: string;
    setActionName: (value: string) => void;
    permissionName: string;
    setPermissionName: (value: string) => void;
    onSubmit: (e: SyntheticEvent<HTMLFormElement>) => void;
    isEditing: boolean;
    onCancel?: () => void;
    saving?: boolean;
}

export default function SystemPermissionsForm({
    moduleName,
    setModuleName,
    actionName,
    setActionName,
    permissionName,
    setPermissionName,
    onSubmit,
    isEditing,
    onCancel,
    saving = false,
}: Props) {

    const t = useTranslations("common");
    
    return (
        <form onSubmit={onSubmit} className={formStyles.form}>
            <h2>{isEditing ? 'Editar Permiso del Sistema' : 'Crear Permiso del Sistema'}</h2>

            <Input
                label="Nombre del Módulo"
                value={moduleName}
                onChange={setModuleName}
                placeholder="Ej. contentStatus, movie, etc."
                required
                disabled={saving}
                autoFocus={!isEditing}
            />

            <Input
                label="Nombre de la Acción"
                value={actionName}
                onChange={setActionName}
                placeholder="Ej. CREATE, READ, UPDATE, DELETE"
                required
                disabled={saving}
                autoFocus={!isEditing}
            />

            <Input
                label="Nombre del Permiso"
                value={permissionName}
                onChange={setPermissionName}
                placeholder="Ej. PERMITIR_CREAR, PERMITIR_LEER, etc."
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