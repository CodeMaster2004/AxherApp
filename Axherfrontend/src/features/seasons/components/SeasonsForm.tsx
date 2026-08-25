"use client";

import { ContentStatusResponse } from "@/entities/types";
import Button from "@/shared/components/ui/Button";
import Input from "@/shared/components/ui/Input";
import Select, { SelectOption } from "@/shared/components/ui/Select";
import TextArea from "@/shared/components/ui/TextArea";
import formStyles from "@/shared/styles/shared/Form.module.css";
import { useTranslations } from "next-intl";

interface Props {
    seasonNumber: number;
    title: string;
    description?: string;
    releaseDate?: string;
    selectedStatusId?: number;
    availableStatuses: ContentStatusResponse[];

    setSeasonNumber: (value: number) => void;
    setTitle: (value: string) => void;
    setDescription: (value: string) => void;
    setReleaseDate: (value: string) => void;
    setSelectedStatusId: (value?: number) => void;

    onSubmit: React.FormEventHandler<HTMLFormElement>;
    isEditing?: boolean;
    saving?: boolean;
    onCancel?: () => void;
}

export default function SeasonsForm({
    seasonNumber,
    title,
    description,
    releaseDate,
    selectedStatusId,
    availableStatuses,
    setSeasonNumber,
    setTitle,
    setDescription,
    setReleaseDate,
    setSelectedStatusId,
    onSubmit,
    isEditing,
    saving = false,
    onCancel,
}: Props) {

    const common = useTranslations("common");
    const t = useTranslations("seasons");
    
    const statusOptions: SelectOption[] = availableStatuses.map((status) => ({
        value: status.contentStatusId,
        label: status.name,
    }));

    return (
        
        <form onSubmit={onSubmit} className={formStyles.form}>

            <Input
                label={t("form.seasonNumber")}
                type="number"
                value={seasonNumber.toString()}
                onChange={(val) => setSeasonNumber(Number(val))}
                required
                min={1}
                disabled={saving}
                autoFocus={!isEditing}
            />
            
            <Input
                label={common("title")}
                value={title}
                onChange={setTitle}
                required
                disabled={saving}
            />
            
            <TextArea
                label={common("description")}
                value={description || ""}
                onChange={setDescription}
                rows={4}
                disabled={saving}
            />

            <Input
                label={t("form.releaseDate")}
                type="datetime-local"
                value={releaseDate || ""}
                onChange={setReleaseDate}
                disabled={saving}
            />

            <Select
                label={common("status")}
                options={statusOptions}
                value={selectedStatusId}
                onChange={(val) => setSelectedStatusId(val as number | undefined)}
                placeholder={t("placeholders.selectStatus")}
                disabled={saving}
            />

            <div className={formStyles.formActions}>
                <Button
                    type="submit"
                    variant="animated"
                    disabled={saving}
                    loadingText={isEditing ? common("updating") : common("creating")}
                    >
                    {isEditing ? common("update") : common("create")}
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
    )
}