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

    const common = useTranslations("common");
    const t = useTranslations("systemPermissions");
    
    return (
        <form onSubmit={onSubmit} className={formStyles.form}>

            <Input
                label={t("form.moduleLabel")}
                value={moduleName}
                onChange={setModuleName}
                placeholder={t("form.modulePlaceholder")}
                required
                disabled={saving}
                autoFocus={!isEditing}
            />

            <Input
                label={t("form.actionLabel")}
                value={actionName}
                onChange={setActionName}
                placeholder={t("form.actionPlaceholder")}
                required
                disabled={saving}
                autoFocus={!isEditing}
            />

            <Input
                label={t("form.permissionLabel")}
                value={permissionName}
                onChange={setPermissionName}
                placeholder={t("form.permissionPlaceholder")}
                required
                disabled={saving}
                autoFocus={!isEditing}
            />

            <div className={formStyles.formActions}>
                <Button
                    type="submit"
                    variant="animated"
                    disabled={saving}
                    loadingText={isEditing ? common("updating") : common("creating")}
                >
                    {isEditing ? common("update") : common("create")}
                </Button>

                {onCancel && (
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onCancel}
                        disabled={saving}
                    >
                        {common("cancel")}

                    </Button>
                )}

            </div>
        </form>
    )
}