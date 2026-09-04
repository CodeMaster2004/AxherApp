"use client";

import { CinematicRoleResponse, ContentPersonRoleCreateRequest, PersonResponse } from "@/entities/types";
import Button from "@/shared/components/ui/Button";
import Input from "@/shared/components/ui/Input";
import formStyles from "@/shared/styles/shared/Form.module.css";
import Select, { SelectOption } from "@/shared/components/ui/Select";
import { useTranslations } from "next-intl";
import PersonSelector from "@/features/people/components/PersonSelector";

interface Props {
    persons: PersonResponse[];
    cinematicRoles: CinematicRoleResponse[];
    value: ContentPersonRoleCreateRequest;
    onChange: (value: ContentPersonRoleCreateRequest) => void;
    onSubmit: () => void;
    editing?: boolean;
    saving: boolean;
    onCancel: () => void;
}

export default function ContentPersonRoleForm({
    persons,
    cinematicRoles,
    value,
    onChange,
    onSubmit,
    saving = false,
    editing = false,
    onCancel,
}: Props) {
    const common = useTranslations("common");
    const t = useTranslations("contentPersonRole");

    const personOptions: SelectOption[] = persons.map((person) => ({
        value: person.personId,
        label: `${person.firstName} ${person.lastName ?? ""}`.trim(),
    }));

    const cinematicRoleOptions: SelectOption[] =
        cinematicRoles.map((role) => ({
            value: role.cinematicRoleId,
            label: role.name,
        }));

    return (
        <div className={formStyles.form}>
            <PersonSelector
                value={value.personId}
                onChange={(personId) =>
                    onChange({
                        ...value,
                        personId,
                    })
                }
            />

            <Select
                label={t("cinematicRole")}
                options={cinematicRoleOptions}
                value={value.cinematicRoleId}
                onChange={(val) =>
                    onChange({
                        ...value,
                        cinematicRoleId: Number(val),
                    })
                }
                placeholder={t("cinematicRolePlaceholder")}
                disabled={saving}
            />

            <Input
                label={t("characterName")}
                value={value.characterName ?? ""}
                onChange={(val) =>
                    onChange({
                        ...value,
                        characterName: val,
                    })
                }
                placeholder={t("characterNamePlaceholder")}
                disabled={saving}
            />

            <Input
                label={t("orderIndex")}
                type="number"
                min={1}
                value={value.orderIndex == null ? "" : String(value.orderIndex)}
                onChange={(val) =>
                    onChange({
                        ...value,
                        orderIndex: val === "" ? null : Number(val),
                    })
                }
                disabled={saving}
            />

            <div>
                <Button
                    type="button"
                    variant="animated"
                    onClick={onSubmit}
                    disabled={saving}
                    loadingText={common("saving")}
                >
                    {editing
                        ? common("update")
                        : common("save")}
                </Button>

                {editing && (
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
        </div>
    );
}