"use client";

import HeroBannerForm from "@/features/heroBanner/components/HeroBannerForm";
import { useHeroBannerActions } from "@/features/heroBanner/hooks/useHeroBannerActions";
import { useUploadProgress } from "@/shared/hooks/useUploadProgress";
import { useRouter } from "next/navigation";
import { useState } from "react";
import layoutStyles from "@/shared/styles/shared/Layout.module.css"
import { HeroBannerRequest } from "@/entities/types";
import { useLanguage } from "@/features/language/hooks/useLanguage";
import { useTranslations } from "next-intl";

export default function CreateHeroBannerPage() {

    const router = useRouter();
    const t = useTranslations("heroBanner");
    const [form, setForm] = useState<HeroBannerRequest>({
        contentId:0,
        titleOverride:"",
        descriptionOverride:"",
        priority:1,
        startDate:"",
        endDate:"",
        active:true,
        languageId: 0
    });
    const [backdropFile,setBackdropFile] = useState<File|null>(null);
    const[error,setError] = useState("");

    const {languages, loading: languagesLoading} = useLanguage();

    const {
        progress,
        handleProgress,
        resetProgress
    } = useUploadProgress();


    const {
        addHeroBanner,
        saving
    } = useHeroBannerActions({
        onSuccess(){
            router.push("/admin/hero-banners");
        }
    });

    const handleSubmit = async(
        e:React.SyntheticEvent<HTMLFormElement>
    )=>{

        e.preventDefault();

        const titleTrim = form.titleOverride?.trim() ?? "";
        const descriptionTrim = form.descriptionOverride?.trim() ?? "";
        if (!form.contentId) {
            setError(t("form.contentRequired"));
            return;
        }

        if (!form.languageId) {
            setError(t("form.languageRequired"));
            return;
        }

        const formData = new FormData();


        formData.append(
            "contentId",
            form.contentId.toString()
        );

        formData.append(
            "languageId",
            form.languageId.toString()
        );

        formData.append(
            "titleOverride",
            titleTrim
        );


        formData.append(
            "descriptionOverride",
            descriptionTrim
        );


        formData.append(
            "priority",
            (form.priority ?? 0).toString()
        );


        formData.append(
            "active",
            (form.active ?? true).toString()
        );


        if (form.startDate) {
            formData.append(
                "startDate",
                form.startDate
            );
        }

        if (form.endDate) {
            formData.append(
                "endDate",
                form.endDate
            );
        }

        if (backdropFile) {
            formData.append(
                "backdropFile",
                backdropFile
            );
        }


        resetProgress();

        await addHeroBanner(
            formData,
            handleProgress
        );

    };

    const handleCancel = () => {
        router.push("/admin/hero-banners");
    };

    return (
        <div className={layoutStyles.pageContainer}>
            <h1>{t("createTitle")}</h1>
            <HeroBannerForm
                value={form}
                onChange={(value) => {
                    setForm(value);
                    
                    if (error) {
                        setError("");
                    }
                }}
                languages={languages}
                backdropFile={backdropFile}
                setBackdropFile={setBackdropFile}
                onSubmit={handleSubmit}
                isEditing={false}
                saving={saving || languagesLoading}
                error={error || undefined}
                onCancel={handleCancel}
                
            />
        </div>
    )


}