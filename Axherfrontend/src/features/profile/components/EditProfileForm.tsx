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

    const common = useTranslations("common");
    const t = useTranslations("profile");

    const typeOptions: SelectOption[] = [
            { value: "", label: t("genders.notSpecified") },
            { value: "MALE", label: t("genders.male") },
            { value: "FEMALE", label: t("genders.female") },
            { value: "OTHER", label: t("genders.other") },
            { value: "PREFER_NOT_TO_SAY", label: t("genders.preferNotToSay") },   
        ];
    return (

        <form onSubmit={onSubmit} className={formStyles.form}>
            <h2>Editar Perfil</h2>

            <Input
                label={t("form.displayName")}
                value={displayName}
                onChange={setDisplayName}
                placeholder={t("form.displayNamePlaceholder")}
                disabled={saving}
            />

            <Input
                label={t("form.firstName")}
                value={firstName}
                onChange={setFirstName}
                placeholder="Juan"
                disabled={saving}
            />

            <Input
                label={t("form.lastName")}
                value={lastName}
                onChange={setLastName}
                placeholder={t("form.lastNamePlaceholder")}
                disabled={saving}
            />

            <Input
                label={t("form.birthDate")}
                type="date"
                value={birthDate}
                onChange={setBirthDate}
                disabled={saving}
            />
            <Select
                label={t("form.gender")}
                options={typeOptions}
                value={gender ?? ""}
                onChange={(val) =>
                    setGender(val ? (val as GenderEnum) : undefined)
                }
                disabled={saving}
            />

            <TextArea
                label={t("form.bio")}
                value={bio}
                onChange={setBio}
                placeholder={t("form.bioPlaceholder")}
                disabled={saving}
                rows={4}
            />

            <Input
                label={t("form.location")}
                value={location}
                onChange={setLocation}
                placeholder={t("form.locationPlaceholder")}
                disabled={saving}
            />

            <Input
                label={t("form.website")}
                type="url"
                value={website}
                onChange={setWebsite}
                placeholder={t("form.websitePlaceholder")}
                disabled={saving}
            />

            <Select
                label={t("form.visibility")}
                value={profileVisibility}
                onChange={(value) => setProfileVisibility((value as "PUBLIC" | "PRIVATE") ?? "PUBLIC")}
                options={[
                    { value: "PUBLIC", label: t("form.visibility.public") },
                    { value: "PRIVATE", label: t("form.visibility.private") },
                ]}
                disabled={saving}
            />

            <div className={formStyles.formActions}>
                <Button type="submit" variant="animated" disabled={saving} loadingText={common("saving")}>
                    {common("save")}
                </Button>

                {onCancel && (
                    <Button type="button" variant="secondary" onClick={onCancel} disabled={saving}>
                        {common("cancel")}
                    </Button>
                )}
            </div>

        </form>
    )
}
