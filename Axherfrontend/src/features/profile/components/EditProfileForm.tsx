"use client";

import { GenderEnum } from "@/entities/types";
import formStyles from "@/shared/styles/shared/Form.module.css";
import { SyntheticEvent } from "react";
import Button from "../../../shared/components/ui/Button";
import Input from "../../../shared/components/ui/Input";
import Select, { SelectOption } from "../../../shared/components/ui/Select";
import TextArea from "../../../shared/components/ui/TextArea";
import { useTranslations } from "next-intl";

interface Props {
    displayName: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    gender?: GenderEnum;
    bio: string;
    location: string;
    website: string;
    profileVisibility: "PUBLIC" | "PRIVATE";
    setDisplayName: (value: string) => void;
    setFirstName: (value: string) => void;
    setLastName: (value: string) => void;
    setBirthDate: (value: string) => void;
    setGender: (value?: GenderEnum) => void;
    setBio: (value: string) => void;
    setLocation: (value: string) => void;
    setWebsite: (value: string) => void;
    setProfileVisibility: (value: "PUBLIC" | "PRIVATE") => void;
    onSubmit: (e: SyntheticEvent<HTMLFormElement>) => void;
    onCancel?: () => void;
    saving?: boolean;
}

export default function EditProfileForm ({
    displayName,
    firstName,
    lastName,
    birthDate,
    gender,
    bio,
    location,
    website,
    profileVisibility,
    setDisplayName,
    setFirstName,
    setLastName,
    setBirthDate,
    setGender,
    setBio,
    setLocation,
    setWebsite,
    setProfileVisibility,
    onSubmit,
    onCancel,
    saving = false,
}: Props ){

    const t = useTranslations("common");

    const typeOptions: SelectOption[] = [
            { value: "", label: "No especificar" },
            { value: "MALE", label: "Masculino" },
            { value: "FEMALE", label: "Femenino" },
            { value: "OTHER", label: "Otro" },
            { value: "PREFER_NOT_TO_SAY", label: "Prefiero no decirlo" },   
        ];
    return (

        <form onSubmit={onSubmit} className={formStyles.form}>
            <h2>Editar Perfil</h2>

            <Input
                label="Nombre para mostrar"
                value={displayName}
                onChange={setDisplayName}
                placeholder="ej. Juan Pérez"
                disabled={saving}
            />

            <Input
                label="Nombre"
                value={firstName}
                onChange={setFirstName}
                placeholder="Juan"
                disabled={saving}
            />

            <Input
                label="Apellido"
                value={lastName}
                onChange={setLastName}
                placeholder="Pérez"
                disabled={saving}
            />

            <Input
                label="Fecha de nacimiento"
                type="date"
                value={birthDate}
                onChange={setBirthDate}
                disabled={saving}
            />
            <Select
                label="Tipo de genero"
                options={typeOptions}
                value={gender ?? ""}
                onChange={(val) =>
                    setGender(val ? (val as GenderEnum) : undefined)
                }
                disabled={saving}
            />

            <TextArea
                label="Biografía"
                value={bio}
                onChange={setBio}
                placeholder="Cuéntanos sobre ti..."
                disabled={saving}
                rows={4}
            />

            <Input
                label="Ubicación"
                value={location}
                onChange={setLocation}
                placeholder="Ciudad, País"
                disabled={saving}
            />

            <Input
                label="Sitio web"
                type="url"
                value={website}
                onChange={setWebsite}
                placeholder="https://ejemplo.com"
                disabled={saving}
            />

            <Select
                label="Visibilidad del perfil"
                value={profileVisibility}
                onChange={(value) => setProfileVisibility((value as "PUBLIC" | "PRIVATE") ?? "PUBLIC")}
                options={[
                    { value: "PUBLIC", label: "Público" },
                    { value: "PRIVATE", label: "Privado" },
                ]}
                disabled={saving}
            />

            <div className={formStyles.formActions}>
                <Button type="submit" variant="animated" disabled={saving} loadingText="Guardando...">
                    {t("save")}
                </Button>

                {onCancel && (
                    <Button type="button" variant="secondary" onClick={onCancel} disabled={saving}>
                        {t("cancel")}
                    </Button>
                )}
            </div>

        </form>
    )
}
