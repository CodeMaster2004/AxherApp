"use client";

import type { SyntheticEvent } from "react";
import formStyles from "@/shared/styles/shared/Form.module.css";
import Input from "@/shared/components/ui/Input";
import Button from "@/shared/components/ui/Button";
import { useTranslations } from "next-intl";

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

    const common = useTranslations("common");
    const t = useTranslations("systemRoles");


    return (

        <form onSubmit={onSubmit} className={formStyles.form}>

            <Input
                label={t("form.roleName")}
                value={roleName}
                onChange={setRoleName}
                placeholder={t("form.roleNamePlaceholder")}
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