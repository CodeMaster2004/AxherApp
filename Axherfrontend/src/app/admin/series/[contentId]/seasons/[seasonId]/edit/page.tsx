"use client";

import { SeasonDetail } from "@/entities/types";
import { useContentStatus } from "@/features/contentStatus/hooks";
import SeasonsForm from "@/features/seasons/components/SeasonsForm";
import { useSeasonsActions } from "@/features/seasons/hooks";
import { seasonsService } from "@/features/seasons/services/SeasonsService";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditSeasonPage() {
    const { contentStatus: statuses = [] } = useContentStatus();
    const router = useRouter();
    const params = useParams();
    const contentId = params?.contentId ? Number(params.contentId) : null;
    const seasonId = params?.seasonId ? Number(params.seasonId) : null;
    const common = useTranslations("common");
    const t = useTranslations("seasons");
    const [seasonNumber, setSeasonNumber] = useState(1);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [releaseDate, setReleaseDate] = useState("");
    const [selectedStatusId, setSelectedStatusId] = useState<number | undefined>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const { saving, editSeason } = useSeasonsActions(contentId || 0, {
        onSuccess: () => router.push(`/admin/contents/${contentId}`),
    });

    useEffect(() => {
        if (!contentId || !seasonId) {
            router.push("/admin/contents");
            return;
        }

        const loadSeason = async () => {
            try {
                const season: SeasonDetail = await seasonsService.getById(contentId, seasonId);
                setSeasonNumber(season.seasonNumber);
                setTitle(season.title);
                setDescription(season.description || "");
                setReleaseDate(season.releaseDate || "");
                if(statuses.length > 0) {
                    setSelectedStatusId(
                        statuses.find((s) => s.code === season.status.code)?.contentStatusId
                    );
                }
            } catch (err) {
                console.error(t("errors.load"), err);
                router.push(`/admin/contents/${contentId}`);
            } finally {
                setLoading(false);
            }
        };

        loadSeason();
    }, [contentId, seasonId, statuses, router]);

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!title.trim()) {
            setError(t("form.validation.titleRequired"));
            return;
        }

        setError("");

        const formData = new FormData();
        formData.append("seasonNumber", seasonNumber.toString());
        formData.append("title", title.trim());
        formData.append("description", description.trim());
        if (releaseDate) formData.append("releaseDate", releaseDate);
        if(selectedStatusId){
            formData.append("statusId", selectedStatusId.toString());
        }

        try {
            await editSeason(seasonId!, formData);
        } catch (err) {
            setError(t("errors.update"));
            console.error(err);
        }
    };

    const handleCancel = () => {
        router.push(`/admin/contents/${contentId}`);
    };

    if (loading) {
        return <div className={layoutStyles.loading}>{common("loading")}...</div>;
    }

    return (
        <div className={layoutStyles.pageContainer}>
            <h1>{t("form.editTitle")}</h1>
            
            {error && <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}

            <SeasonsForm
                seasonNumber={seasonNumber}
                title={title}
                description={description}
                releaseDate={releaseDate}
                selectedStatusId={selectedStatusId}
                availableStatuses={statuses}
                setSeasonNumber={setSeasonNumber}
                setTitle={setTitle}
                setDescription={setDescription}
                setReleaseDate={setReleaseDate}
                setSelectedStatusId={setSelectedStatusId}
                onSubmit={handleSubmit}
                saving={saving}
                isEditing={true}
                onCancel={handleCancel}
            />
        </div>
    );
}
