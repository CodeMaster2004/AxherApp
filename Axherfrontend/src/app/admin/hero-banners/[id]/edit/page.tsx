"use client";

import HeroBannerForm from "@/features/heroBanner/components/HeroBannerForm";
import { useHeroBannerActions } from "@/features/heroBanner/hooks/useHeroBannerActions";
import { heroBannerService } from "@/features/heroBanner/services/heroBannerService";
import { useUploadProgress } from "@/shared/hooks/useUploadProgress";
import ProgressBar from "@/shared/components/ui/ProgressBar";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HeroBannerRequest } from "@/entities/types";
import { useLanguage } from "@/features/language/hooks/useLanguage";
import { useTranslations } from "next-intl";


export default function EditHeroBannerPage(){

    const router = useRouter();
    const params = useParams();

    const id = params?.id 
        ? Number(params.id)
        : null;

    const [form, setForm] = useState<HeroBannerRequest>({
        contentId:0,
        titleOverride:"",
        descriptionOverride:"",
        priority:1,
        startDate:"",
        endDate:"",
        active:true,
        languageId: 0
    })
    
    const [backdropFile,setBackdropFile] = useState<File | null>(null);
    const [backdropUrl,setBackdropUrl] = useState("");
    const t = useTranslations("heroBanner");
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState("");

    const {languages, loading: languagesLoading} = useLanguage();

    const {
        progress,
        handleProgress,
        resetProgress

    } = useUploadProgress();

    const {
        editHeroBanner,
        saving

    } = useHeroBannerActions({

        onSuccess(){
            router.push("/admin/hero-banners");
        }

    });

    useEffect(()=>{

        if(id === null){
            router.push("/admin/hero-banners");
            return;
        }

        const loadBanner = async()=>{

            try{

                const banner =
                    await heroBannerService.getById(id);

                setForm({
                    contentId: banner.contentId,
                    titleOverride: banner.titleOverride ?? "",
                    descriptionOverride:
                        banner.descriptionOverride ?? "",
                    priority: banner.priority ?? 1,
                    startDate: banner.startDate ?? "",
                    endDate: banner.endDate ?? "",
                    active: banner.active ?? true,
                    languageId: banner.languageId,
                });
                setBackdropUrl(
                    banner.backdropUrl ?? ""
                );

            }catch(error){
                console.error(error);
                router.push("/admin/hero-banners");
                setError(
                (t("errors.load"))
                );
            }finally{

                setLoading(false);

            }

        };


        loadBanner();

    },[id,router]);



    const handleSubmit = async(
        e: React.SyntheticEvent<HTMLFormElement>
    )=>{

        e.preventDefault();

        if (!id) {
            return;
        }

        const titleTrim =
            form.titleOverride?.trim() ?? "";

        const descriptionTrim =
            form.descriptionOverride?.trim() ?? "";

        if (!form.contentId) {

            setError(
                t("form.contentRequired")
            );

            return;
        }

        if (!form.languageId) {

            setError(
                t("form.languageRequired")
            );

            return;
        }

        setError("");

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
            (form.priority ?? 1).toString()
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

        await editHeroBanner(
            id,
            formData
        );

    };
    const handleCancel = () => {
        router.push("/admin/hero-banners");
    };

    if(loading){

        return (
            <div className={layoutStyles.loading}>
                {t("list.loading")}
            </div>
        )

    }

    return (

        <div className={layoutStyles.pageContainer}>

            <h1>
                {t("editTitle")}
            </h1>

            <ProgressBar
                progress={progress}
            />

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
                backdropUrl={backdropUrl}               
                onSubmit={handleSubmit}
                isEditing={true}
                saving={saving || languagesLoading}
                error={error || undefined}
                onCancel={handleCancel}
            />

        </div>

    )

}