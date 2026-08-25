"use client";
import Button from "@/shared/components/ui/Button";
import FileInput from "@/shared/components/ui/FileInput";
import FilePreviewOrLink from "@/shared/components/ui/FilePreviewOrLink";
import formStyles from "@/shared/styles/shared/Form.module.css";
import Input from "@/shared/components/ui/Input";
import TextArea from "@/shared/components/ui/TextArea";
import Select, { SelectOption } from "@/shared/components/ui/Select";
import { useTranslations } from "next-intl";
import { ContentStatusResponse } from "@/entities/types";

interface Props {
    episodeNumber: number;
    title: string;
    description?: string;
    releaseDate?: string;
    selectedStatusId?: number;
    availableStatuses: ContentStatusResponse[];

    thumbnailFile?: File | null;
    episodeFile: File | null;
    thumbnailUrl?: string;
    episodeUrl?: string;

    setEpisodeNumber: (value: number) => void;
    setTitle: (value: string) => void;
    setDescription: (value?: string) => void;
    setReleaseDate: (value: string) => void;
    setSelectedStatusId: (value?: number) => void;
    setThumbnailFile: (file: File | null) => void;
    setEpisodeFile: (file: File | null) => void;

    onSubmit: React.FormEventHandler<HTMLFormElement>;
    isEditing: boolean;
    saving?: boolean;
    onCancel?: () => void;
}

export default function EpisodesForm({
    episodeNumber,
    title,
    description,
    releaseDate,
    episodeFile,
    episodeUrl,
    availableStatuses,
    selectedStatusId,
    thumbnailFile,
    thumbnailUrl,
    setEpisodeNumber,
    setTitle,
    setDescription,
    setReleaseDate,
    setEpisodeFile,
    setThumbnailFile,
    setSelectedStatusId,
    onSubmit,
    isEditing,
    saving = false,
    onCancel,
}: Props) {
    const common = useTranslations("common");
    const t = useTranslations("episodes");
    const statusOptions: SelectOption[] = availableStatuses.map((status) => ({
        value: status.contentStatusId,
        label: status.name,
    }));
    return (
        <form onSubmit={onSubmit} className={formStyles.form}>

            <Input
                label={t("form.episodeNumber")}
                type="number"
                value={episodeNumber.toString()}
                onChange={(val) => setEpisodeNumber(Number(val))}
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
                label={t("form.status")}
                options={statusOptions}
                value={selectedStatusId}
                onChange={(val) => setSelectedStatusId(val as number | undefined)}
                placeholder={t("form.statusPlaceholder")}
                disabled={saving}
            />


            <FileInput
                label={t("form.thumbnail")}
                accept="image/*"
                onChange={setThumbnailFile}
                disabled={saving}
            />
            {!thumbnailFile && (
                <FilePreviewOrLink url={thumbnailUrl} type="image" label={t("form.currentThumbnail")} file={null} />
            )}
            <FileInput
                label={t("form.episodeFile")}
                accept="video/*"
                onChange={setEpisodeFile}
                disabled={saving}
            />
            {!episodeFile && (
                <FilePreviewOrLink url={episodeUrl} type="video" label={t("form.currentEpisode")} file={null} />
            )}

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
    );
}