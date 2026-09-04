"use client";

import {
    CinematicRoleResponse,
    ContentPersonRoleCreateRequest,
    ContentPersonRoleResponse,
    ContentPersonRoleUpdateRequest,
    PersonResponse,
} from "@/entities/types";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { useContentPersonRoles } from "@/features/people/hooks/useContentPersonRoles";
import { useContentPersonRoleActions } from "@/features/people/hooks/useContentPersonRoleActions";

import ContentPersonRoleForm from "@/features/people/components/ContentPersonRoleForm";
import ContentPersonRoleList from "@/features/people/components/ContentPersonRoleList";

interface Props {
    contentId: number;
    persons: PersonResponse[];
    cinematicRoles: CinematicRoleResponse[];
}

const initialForm: ContentPersonRoleCreateRequest = {
    personId: 0,
    cinematicRoleId: 0,
    characterName: "",
    orderIndex: null,
};

export default function ContentPersonRolesPanel({
    contentId,
    persons,
    cinematicRoles,
}: Props) {
    const t = useTranslations("contentPersonRole");

    const {
        contentPersonRoles,
        loading,
        refetch,
    } = useContentPersonRoles({
        contentId,
    });

    const {
        saving,
        deleting,
        moving,
        error,
        addContentPersonRole,
        editContentPersonRole,
        removeContentPersonRole,
        moveContentPersonRole,
    } = useContentPersonRoleActions({
        onSuccess: refetch,
    });

    const [form, setForm] =
        useState<ContentPersonRoleCreateRequest>(
            initialForm
        );

    const [
        editingContentPersonRoleId,
        setEditingContentPersonRoleId,
    ] = useState<number | null>(null);

    const resetForm = () => {
        setForm({
            ...initialForm,
        });

        setEditingContentPersonRoleId(null);
    };

    const handleSubmit = async () => {
        if (
            form.personId === null ||
            form.cinematicRoleId === null
        ) {
            return;
        }

        if (editingContentPersonRoleId !== null) {
            const updateData: ContentPersonRoleUpdateRequest = {
                personId: form.personId,
                cinematicRoleId: form.cinematicRoleId,
                characterName: form.characterName,
                ...(form.orderIndex !== null && {
                    orderIndex: form.orderIndex,
                }),
            };

            await editContentPersonRole(
                contentId,
                editingContentPersonRoleId,
                updateData
            );
        } else {
            const createData: ContentPersonRoleCreateRequest = {
                personId: form.personId,
                cinematicRoleId: form.cinematicRoleId,
                characterName: form.characterName,
                orderIndex: form.orderIndex,
            };

            await addContentPersonRole(
                contentId,
                createData
            );
        }

        resetForm();
    };

    const handleEdit = (
        item: ContentPersonRoleResponse
    ) => {
        setEditingContentPersonRoleId(
            item.contentPersonRoleId
        );

        setForm({
            personId: item.personId,
            cinematicRoleId: item.cinematicRoleId,
            characterName:
                item.characterName ?? "",
            orderIndex:
                item.orderIndex ?? 0,
        });
    };

    const handleDelete = async (
        contentPersonRoleId: number
    ) => {
        await removeContentPersonRole(
            contentId,
            contentPersonRoleId
        );
    };

    const handleMove = async (
        contentPersonRoleId: number,
        orderIndex: number
    ) => {
        await moveContentPersonRole(
            contentId,
            contentPersonRoleId,
            orderIndex
        );
    };

    return (
        <div>
            <section>
                <ContentPersonRoleForm
                    persons={persons}
                    cinematicRoles={cinematicRoles}
                    value={form}
                    onChange={setForm}
                    onSubmit={handleSubmit}
                    saving={saving}
                    editing={
                        editingContentPersonRoleId !== null
                    }
                    onCancel={resetForm}
                />

                {Boolean(error) && (
                    <p role="alert">
                        {t("error")}
                    </p>
                )}
            </section>

            <section>
                <h3>
                    {t("registeredTitle")}
                </h3>

                <ContentPersonRoleList
                    contentPersonRoles={
                        contentPersonRoles
                    }
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onMove={handleMove}
                    deletingId={deleting}
                    movingId={moving}
                    loading={loading}
                />
            </section>
        </div>
    );
}