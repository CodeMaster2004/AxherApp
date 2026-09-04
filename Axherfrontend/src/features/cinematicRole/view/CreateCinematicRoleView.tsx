"use client";

import { CinematicRoleRequest } from "@/entities/types";
import CinematicRoleForm from "@/features/cinematicRole/components/CinematicRoleForm";
import { useCinematicRoleActions } from "@/features/cinematicRole/hooks/useCinematicRoleActions";
import { useLanguage } from "@/features/language/hooks/useLanguage";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";

export default function CreateCinematicRoleView() {

    const router = useRouter();
    const t = useTranslations("cinematicRole");
    const [error, setError] = useState("");

    const {
        addCinematicRole,
        saving,
    } = useCinematicRoleActions({
        onSuccess: () =>
            router.push(
                "/admin/cinematic-roles"
            ),
    });

    const {
        languages,
        loading: languagesLoading,
    } = useLanguage();

    const [form, setForm] =
        useState<CinematicRoleRequest>({
            code: "",
            name: "",
            description: "",
            languageId: 0,
        });

    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        const codeTrim =
            form.code.trim();

        const nameTrim =
            form.name.trim();

        const descriptionTrim =
            form.description.trim();

        if (!codeTrim) {
            setError(
                t(
                    "form.validation.codeRequired"
                )
            );
            return;
        }

        if (!form.languageId) {
            setError(
                t(
                    "form.validation.languageRequired"
                )
            );
            return;
        }

        if (!nameTrim) {
            setError(
                t(
                    "form.validation.nameRequired"
                )
            );
            return;
        }

        await addCinematicRole({
            code: codeTrim,
            name: nameTrim,
            description: descriptionTrim,
            languageId: form.languageId,
        });
    };

    const handleCancel = () => {
        router.push(
            "/admin/cinematic-roles"
        );
    };

    return (
        <div
            className={
                layoutStyles.pageContainer
            }
        >

            <h1>
                {t("createTitle")}
            </h1>

            <CinematicRoleForm
                value={form}
                onChange={value => {

                    setForm(value);

                    if (error) {
                        setError("");
                    }
                }}
                languages={languages}
                onSubmit={handleSubmit}
                isEditing={false}
                onCancel={handleCancel}
                saving={
                    saving ||
                    languagesLoading
                }
                error={
                    error || undefined
                }
            />

        </div>
    );
}