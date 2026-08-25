"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import layoutStyles from "@/shared/styles/shared/Layout.module.css"
import SeasonsForm from "@/features/seasons/components/SeasonsForm";
import { useSeasonsActions } from "@/features/seasons/hooks";
import { useContentStatus } from "@/features/contentStatus/hooks";
import { useTranslations } from "next-intl";

export default function CreateSeasonPage() {
    const { contentStatus: statuse = []} = useContentStatus();
    const router = useRouter();
    const params = useParams();
    const contentId = params?.contentId ? Number(params.contentId) : null;

    const [seasonNumber, setSeasonNumber] = useState(1);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [releaseDate, setReleaseDate] = useState("");
    const [selectedStatusId, setSelectedStatusId] = useState<number | undefined>();
    const [error, setError] = useState("");
    const t = useTranslations("seasons");

    const { saving, addSeason } = useSeasonsActions(contentId || 0, {
        onSuccess: () => router.push(`/admin/series/${contentId}/seasons`),
    });

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!title.trim()) {
            setError(t("translations.validation.titleRequired"));
            return;
        }

        if (!seasonNumber || seasonNumber <= 0) {
            setError(t("translations.validation.seasonNumberInvalid"));
            return;
        }

        setError("");

        const formData = new FormData();
        formData.append("seasonNumber", seasonNumber.toString());
        formData.append("title", title.trim());
        formData.append("description", description.trim());
        if (releaseDate) formData.append("releaseDate", releaseDate);
        if (selectedStatusId) formData.append("statusId", selectedStatusId.toString());
        try {
            await addSeason(formData);
        } catch (err) {
            setError(t("errors.create"));
            console.error(err);
        }
    };

    const handleCancel = () => {
        router.push(`/admin/series/${contentId}/seasons`);
    };

    return (
        <div className={layoutStyles.pageContainer}>
            <h1>{t("form.createTitle")}</h1>
            
            {error && <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}

            <SeasonsForm
                seasonNumber={seasonNumber}
                title={title}
                description={description}
                releaseDate={releaseDate}
                availableStatuses={statuse}
                setSeasonNumber={setSeasonNumber}
                setTitle={setTitle}
                setDescription={setDescription}
                setReleaseDate={setReleaseDate}
                selectedStatusId={selectedStatusId}
                setSelectedStatusId={setSelectedStatusId}
                onSubmit={handleSubmit}
                saving={saving}
                onCancel={handleCancel}
            />
        </div>
    );
}
