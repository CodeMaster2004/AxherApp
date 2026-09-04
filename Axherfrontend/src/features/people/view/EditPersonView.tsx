"use client";

import { PersonCreateRequest, PersonResponse, PersonUpdateRequest } from "@/entities/types";
import PersonForm from "@/features/people/components/PersonForm";
import { usePersonActions } from "@/features/people/hooks/usePersonActions";
import { personService } from "@/features/people/services/personService";
import ProgressBar from "@/shared/components/ui/ProgressBar";
import { useUploadProgress } from "@/shared/hooks/useUploadProgress";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditPersonView() {

    const router = useRouter();
    const params = useParams();

    const id = params?.id
        ? Number(params.id)
        : null;

    const t = useTranslations("person");

    const [form, setForm] =
        useState<PersonCreateRequest>({
            firstName: "",
            lastName: "",
        });

    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoUrl, setPhotoUrl] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const {
        progress,
        handleProgress,
        resetProgress,
    } = useUploadProgress();

    const {
        editPerson,
        saving,
    } = usePersonActions({
        onSuccess: () => {
            router.push( "/admin/people" );
        },
    });

    useEffect(() => {

        if (id === null) {
            router.push( "/admin/people" );
            return;
        }

        const loadPerson = async () => {

            try {

                const person:
                    PersonResponse =
                    await personService.getById(
                        id
                    );

                setForm({
                    firstName:
                        person.firstName,
                    lastName:
                        person.lastName ?? "",
                });

                setPhotoUrl( person.photo ?? "" );

            } catch (err) {

                console.error(err);

                setError( t("errors.load") );

            } finally {

                setLoading(false);

            }
        };

        loadPerson();

    }, [id, router, t]);

    const handleSubmit = async (
        e: React.SyntheticEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        if (id === null) {
            return;
        }

        const firstName = form.firstName?.trim() ?? "";
        const lastName = form.lastName?.trim() ?? "";

        if (!firstName) {
            setError( t( "form.validation.firstNameRequired" ) );
            return;
        }

        setError("");

        const formData = new FormData();

        formData.append(
            "firstName",
            firstName
        );

        if (lastName) {
            formData.append( "lastName", lastName );
        }

        if (photoFile) {
            formData.append( "photo", photoFile );
        }

        resetProgress();

        await editPerson(
            id,
            formData,
            handleProgress
        );
    };

    const handleCancel = () => {

        router.push(
            "/admin/people"
        );
    };

    if (loading) {
        return (
            <div
                className={
                    layoutStyles.loading
                }
            >
                {t("loading")}
            </div>
        );
    }

    return (
        <div
            className={
                layoutStyles.pageContainer
            }
        >

            <h1>
                {t("editTitle")}
            </h1>

            <ProgressBar
                progress={progress}
            />

            <PersonForm
                value={form}
                onChange={setForm}
                photoFile={photoFile}
                photoUrl={photoUrl}
                setPhotoFile={
                    setPhotoFile
                }
                onSubmit={handleSubmit}
                isEditing={true}
                saving={saving}
                error={
                    error || undefined
                }
                onCancel={handleCancel}
            />

        </div>
    );
}