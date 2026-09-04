"use client";

import { PersonCreateRequest } from "@/entities/types";
import PersonForm from "@/features/people/components/PersonForm";
import { usePersonActions } from "@/features/people/hooks/usePersonActions";
import ProgressBar from "@/shared/components/ui/ProgressBar";
import { useUploadProgress } from "@/shared/hooks/useUploadProgress";
import { useTranslations } from "next-intl";
import { useState } from "react";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import { useRouter } from "next/navigation";

export default function CreatePersonView() {

    const router = useRouter();
    const t = useTranslations("person");

    const [form, setForm] =
        useState<PersonCreateRequest>({
            firstName: "",
            lastName: "",
        });

    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [error, setError] = useState("");
    
    const {
        progress,
        handleProgress,
        resetProgress,
    } = useUploadProgress();

    const {
        addPerson,
        saving,
    } = usePersonActions({
        onSuccess: () => {
            router.push(
                "/admin/people"
            );
        },
    });

    const handleSubmit = async (
        e: React.SyntheticEvent<HTMLFormElement>
    ) => {

        e.preventDefault();
        const firstName = form.firstName.trim();
        const lastName = form.lastName?.trim() ?? "";

        if (!firstName) {
            setError(
                t("form.validation.firstNameRequired")
            );
            return;
        }

        setError("");

        const formData = new FormData();

        formData.append( "firstName", firstName );

        if (lastName) {
            formData.append( "lastName", lastName );
        }

        if (photoFile) {
            formData.append( "photo", photoFile );
        }

        resetProgress();
        console.log("========== FORMDATA ==========");

for (const [key, value] of formData.entries()) {
    console.log(key, value);
}

        await addPerson(
            formData,
            handleProgress
        );
    };

    const handleCancel = () => {
        router.push( "/admin/people" );
    };

    return (
        <div
            className={
                layoutStyles.pageContainer
            }
        >

            <h1> {t("createTitle")} </h1>

            <ProgressBar
                progress={progress}
            />

            <PersonForm
                value={form}
                onChange={setForm}
                photoFile={photoFile}
                setPhotoFile={setPhotoFile}
                onSubmit={handleSubmit}
                isEditing={false}
                saving={saving}
                error={
                    error || undefined
                }
                onCancel={handleCancel}
            />

        </div>
    );
}