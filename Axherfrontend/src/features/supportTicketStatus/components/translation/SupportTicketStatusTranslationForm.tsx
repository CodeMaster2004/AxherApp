"use client";

import { LanguageResponse, SupportTicketStatusTranslationRequest } from "@/entities/types";
import Button from "@/shared/components/ui/Button";
import Input from "@/shared/components/ui/Input";
import Select, { SelectOption } from "@/shared/components/ui/Select";
import TextArea from "@/shared/components/ui/TextArea";
import formStyles from "@/shared/styles/shared/Form.module.css";
import { useTranslations } from "next-intl";


interface Props {

    languages: LanguageResponse[];
    value: SupportTicketStatusTranslationRequest;
    onChange: (
        value: SupportTicketStatusTranslationRequest
    ) => void;
    onSubmit: () => void;
    editing?: boolean;
    saving: boolean;
    onCancel: () => void;
}


export default function SupportTicketStatusTranslationForm({
    languages,
    value,
    onChange,
    onSubmit,
    saving = false,
    editing = false,
    onCancel,
}: Props) {

    const t = useTranslations("common");

    const languageOptions: SelectOption[] =
        languages.map(language => ({
            value: language.languageId,
            label:
                `${language.name} (${language.nativeName})`,
        }));


    return (

        <div className={formStyles.form}>

            <Select
                label="Idioma"
                options={languageOptions}
                value={value.languageId}

                onChange={(val) =>
                    onChange({
                        ...value,
                        languageId: Number(val),
                    })
                }

                placeholder="Seleccionar idioma"

                disabled={saving || editing}
            />


            <Input
                label="Nombre"
                value={value.name}

                onChange={(val) =>
                    onChange({
                        ...value,
                        name: val,
                    })
                }

                placeholder="Ej: Pendiente"

                disabled={saving}
            />


            <TextArea
                label="Descripción"
                value={value.description}

                onChange={(val) =>
                    onChange({
                        ...value,
                        description: val,
                    })
                }

                placeholder="Descripción del estado del ticket"

                rows={4}

                disabled={saving}
            />


            <div>

                <Button
                    type="button"
                    variant="animated"
                    onClick={onSubmit}
                    disabled={saving}
                    loadingText="Guardando..."
                >
                    {editing
                        ? "Actualizar"
                        : t("save")
                    }
                </Button>


                {editing && (

                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onCancel}
                        disabled={saving}
                    >
                        {t("cancel")}
                    </Button>

                )}

            </div>

        </div>

    );
}