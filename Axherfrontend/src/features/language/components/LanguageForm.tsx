"use client";

import Button from "@/shared/components/ui/Button";
import Input from "@/shared/components/ui/Input";
import styles from "@/shared/styles/shared/Form.module.css";
import { useTranslations } from "next-intl";

interface Props {
    code: string;
    setCode: (value: string) => void;

    name: string;
    setName: (value: string) => void;

    nativeName: string;
    setNativeName: (value: string) => void;

    active: boolean;
    setActive: (value: boolean) => void;

    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    isEditing: boolean;
    onCancel?: () => void;
    saving?: boolean;
    error?: string;
}

export default function LanguageForm({
    code,
    setCode,
    name,
    setName,
    nativeName,
    setNativeName,
    active,
    setActive,
    onSubmit,
    isEditing,
    onCancel,
    saving = false,
    error,
}: Props) {
    const common = useTranslations("common");
    const t = useTranslations("language");
    return (
        <form onSubmit={onSubmit} className={styles.form}>

            {error && (
                <p className={styles.errorMessage}>
                    {error}
                </p>
            )}

            <Input
                label={t("form.code")}
                value={code}
                onChange={setCode}
                placeholder={t("form.codePlaceholder")}
                maxLength={20}
                required
                disabled={saving}
                autoFocus={!isEditing}
            />

            <Input
                label={common("name")}
                value={name}
                onChange={setName}
                placeholder={t("form.namePlaceholder")}
                maxLength={100}
                required
                disabled={saving}
            />

            <Input
                label={t("form.nativeName")}
                value={nativeName}
                onChange={setNativeName}
                placeholder={t("form.nativeNamePlaceholder")}
                maxLength={100}
                required
                disabled={saving}
            />

            <label>
                <input
                    type="checkbox"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    disabled={saving}
                />
                {" "}{t("form.active")}
            </label>

            <div className={styles.formActions}>

                <Button
                    type="submit"
                    variant="animated"
                    loading={saving}
                    loadingText={
                        isEditing ? common("updating") : common("creating")
                    }
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
    );
}
