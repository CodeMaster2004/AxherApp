"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import layoutStyles from "@/shared/styles/shared/Layout.module.css"
import SeasonsForm from "@/features/seasons/components/SeasonsForm";
import { useSeasonsActions } from "@/features/seasons/hooks";
import { useContentStatus } from "@/features/contentStatus/hooks";

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

    const { saving, addSeason } = useSeasonsActions(contentId || 0, {
        onSuccess: () => router.push(`/series/${contentId}`),
    });

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!title.trim()) {
            setError("El título es obligatorio");
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
            setError("Error al crear la temporada");
            console.error(err);
        }
    };

    const handleCancel = () => {
        router.push(`/series/${contentId}`);
    };

    return (
        <div className={layoutStyles.pageContainer}>
            <h1>Crear Nueva Temporada</h1>
            
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
