"use client";

import {CinematicRoleRequest, CinematicRoleResponse,} from "@/entities/types";
import {useCinematicRoleActions,} from "@/features/cinematicRole/hooks/useCinematicRoleActions";
import CinematicRoleForm from "@/features/cinematicRole/components/CinematicRoleForm";
import { useLanguage } from "@/features/language/hooks/useLanguage";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import {useParams, useRouter,} from "next/navigation";
import {useEffect, useState,} from "react";
import { useTranslations } from "next-intl";
import { cinematicRoleService } from "@/features/cinematicRole/services/cinematicRoleService";

export default function EditCinematicRoleView() {

    const router = useRouter();

    const params = useParams();

    const id = params?.id
        ? Number(params.id)
        : null;

    const t =
        useTranslations("cinematicRole");

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [form, setForm] =
        useState<CinematicRoleRequest>({
            code: "",
            name: "",
            description: "",
            languageId: 0,
        });

    const {
        languages,
        loading: languagesLoading,
    } = useLanguage();

    const {
        editCinematicRole,
        saving,
    } = useCinematicRoleActions({
        onSuccess: () =>
            router.push(
                "/admin/cinematic-roles"
            ),
    });

    useEffect(() => {

        if (!id) {
            router.push(
                "/admin/cinematic-roles"
            );
            return;
        }

        const loadRole = async () => {

            try {

                const cinematicRole:
                    CinematicRoleResponse =
                    await cinematicRoleService
                        .getById(id);

                setForm({
                    code:
                        cinematicRole.code,

                    name:
                        cinematicRole.name,

                    description:
                        cinematicRole.description ??
                        "",

                    languageId:
                        cinematicRole.languageId,
                });

            } catch {

                setError(
                    t("errors.load")
                );

                router.push(
                    "/admin/cinematic-roles"
                );

            } finally {

                setLoading(false);
            }
        };

        loadRole();

    }, [id, router, t]);

    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        if (!id) {
            return;
        }

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

        await editCinematicRole(
            id,
            {
                code: codeTrim,
                name: nameTrim,
                description: descriptionTrim,
                languageId: form.languageId,
            }
        );
    };

    const handleCancel = () => {
        router.push(
            "/admin/cinematic-roles"
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
                isEditing={true}
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