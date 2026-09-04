"use client";

import { PersonCreateRequest, PersonUpdateRequest } from "@/entities/types";
import Button from "@/shared/components/ui/Button";
import FileInput from "@/shared/components/ui/FileInput";
import FilePreviewOrLink from "@/shared/components/ui/FilePreviewOrLink";
import Input from "@/shared/components/ui/Input";
import styles from "@/shared/styles/shared/Form.module.css";
import { useTranslations } from "next-intl";

interface Props {
    value: PersonCreateRequest | PersonUpdateRequest;
    onChange: React.Dispatch<
        React.SetStateAction<PersonCreateRequest>
    >;
    photoFile: File | null;
    photoUrl?: string;
    setPhotoFile: (
        file: File | null
    ) => void;
    onSubmit: (
        e: React.SyntheticEvent<HTMLFormElement>
    ) => void;
    isEditing?: boolean;
    saving?: boolean;
    error?: string;
    onCancel?: () => void;
}

export default function PersonForm({
    value,
    onChange,
    photoFile,
    photoUrl,
    setPhotoFile,
    onSubmit,
    isEditing,
    saving = false,
    error,
    onCancel,
}: Props) {

    const common = useTranslations("common");
    const t = useTranslations("person");

    return (
        <form
            className={styles.form}
            onSubmit={onSubmit}
        >

            {error && (
                <p className={styles.errorMessage}>
                    {error}
                </p>
            )}

            <Input
                label={t("form.firstName")}
                value={value.firstName ?? ""}
                onChange={(firstName) =>
                    onChange(prev => ({
                        ...prev,
                        firstName,
                    }))
                }
                placeholder={t(
                    "form.firstNamePlaceholder"
                )}
                disabled={saving}
            />

            <Input
                label={t("form.lastName")}
                value={value.lastName ?? ""}
                onChange={(lastName) =>
                    onChange(prev => ({
                        ...prev,
                        lastName,
                    }))
                }
                placeholder={t(
                    "form.lastNamePlaceholder"
                )}
                disabled={saving}
            />

            <FileInput
                label={t("form.photo")}
                accept="image/*"
                onChange={setPhotoFile}
                disabled={saving}
            />

            {!photoFile && photoUrl && (
                <FilePreviewOrLink
                    url={photoUrl}
                    type="image"
                    label={t(
                        "form.currentPhoto"
                    )}
                    file={null}
                />
            )}

            <div className={styles.formActions}>

                <Button
                    type="submit"
                    variant="animated"
                    loading={saving}
                    loadingText={
                        isEditing
                            ? common("updating")
                            : common("creating")
                    }
                >
                    {isEditing
                        ? common("update")
                        : common("create")}
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
