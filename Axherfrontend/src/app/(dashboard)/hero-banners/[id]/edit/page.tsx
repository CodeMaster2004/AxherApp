"use client";

import HeroBannerForm from "@/features/heroBanner/components/HeroBannerForm";
import { useHeroBannerActions } from "@/features/heroBanner/hooks/useHeroBannerActions";
import { heroBannerService } from "@/features/heroBanner/services/heroBannerService";
import { useUploadProgress } from "@/shared/hooks/useUploadProgress";
import ProgressBar from "@/shared/components/ui/ProgressBar";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function EditHeroBannerPage(){

    const router = useRouter();
    const params = useParams();

    const id = params?.id 
        ? Number(params.id)
        : null;


    const [contentId,setContentId] = useState<number | undefined>();
    const [titleOverride,setTitleOverride] = useState("");
    const [descriptionOverride,setDescriptionOverride] = useState("");
    const [backdropFile,setBackdropFile] = useState<File | null>(null);
    const [backdropUrl,setBackdropUrl] = useState("");
    const [priority,setPriority] = useState(1);
    const [startDate,setStartDate] = useState("");
    const [endDate,setEndDate] = useState("");
    const [active,setActive] = useState(true);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState("");

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
            router.push("/hero-banners");
        }

    });

    useEffect(()=>{

        if(id === null){
            router.push("/hero-banners");
            return;
        }

        const loadBanner = async()=>{

            try{

                const banner =
                    await heroBannerService.getById(id);

                setContentId(
                    banner.contentId
                );

                setTitleOverride(
                    banner.titleOverride ?? ""
                );

                setDescriptionOverride(
                    banner.descriptionOverride ?? ""
                );

                setBackdropUrl(
                    banner.backdropUrl
                );

                setPriority(
                    banner.priority
                );


                setStartDate(
                    banner.startDate ?? ""
                );


                setEndDate(
                    banner.endDate ?? ""
                );


                setActive(
                    banner.active
                );


            }catch(error){

                console.error(error);

                router.push("/hero-banners");

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


        if(id === null)
            return;

        if(contentId === undefined){

            setError(
                "Selecciona un contenido"
            );

            return;
        }

        setError("");

        const formData = new FormData();

        formData.append(
            "contentId",
            contentId.toString()
        );

        formData.append(
            "titleOverride",
            titleOverride.trim()
        );

        formData.append(
            "descriptionOverride",
            descriptionOverride.trim()
        );

        formData.append(
            "priority",
            priority.toString()
        );

        formData.append(
            "active",
            active.toString()
        );


        if(startDate){

            formData.append(
                "startDate",
                startDate
            );

        }

        if(endDate){

            formData.append(
                "endDate",
                endDate
            );

        }

        if(backdropFile){

            formData.append(
                "backdropFile",
                backdropFile
            );

        }

        resetProgress();

        await editHeroBanner(
            id,
            formData,
            handleProgress
        );

    };


    if(loading){

        return (
            <div className={layoutStyles.loading}>
                Cargando banner...
            </div>
        )

    }

    return (

        <div className={layoutStyles.pageContainer}>

            <h1>
                Editar Hero Banner
            </h1>

            <ProgressBar
                progress={progress}
            />

            <HeroBannerForm

                contentId={contentId}
                setContentId={setContentId}
                titleOverride={titleOverride}
                setTitleOverride={setTitleOverride}
                descriptionOverride={descriptionOverride}
                setDescriptionOverride={setDescriptionOverride}
                backdropFile={backdropFile}
                setBackdropFile={setBackdropFile}
                backdropUrl={backdropUrl}
                setBackdropUrl={setBackdropUrl}
                priority={priority}
                setPriority={setPriority}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                active={active}
                setActive={setActive}
                onSubmit={handleSubmit}
                isEditing={true}
                saving={saving}
                onCancel={()=>
                    router.push("/hero-banners")
                }

            />


            {
                error && (

                    <p style={{
                        color:"red"
                    }}>
                        {error}
                    </p>

                )
            }


        </div>

    )

}