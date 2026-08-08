"use client";

import HeroBannerForm from "@/features/heroBanner/components/HeroBannerForm";
import { useHeroBannerActions } from "@/features/heroBanner/hooks/useHeroBannerActions";
import { useUploadProgress } from "@/shared/hooks/useUploadProgress";
import { useRouter } from "next/navigation";
import { useState } from "react";
import layoutStyles from "@/shared/styles/shared/Layout.module.css"

export default function CreateHeroBannerPage() {

    const router = useRouter();

    const [contentId,setContentId] = useState<number | undefined>();
    const [titleOverride,setTitleOverride] = useState("");
    const [descriptionOverride,setDescriptionOverride] = useState("");
    const [priority,setPriority] = useState(1);
    const [startDate,setStartDate] = useState("");
    const [endDate,setEndDate] = useState("");
    const [active,setActive] = useState(true);
    const [backdropFile,setBackdropFile] = useState<File|null>(null);



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
            router.push("/herobanner");
        }
    });

    const handleSubmit = async(
        e:React.SyntheticEvent<HTMLFormElement>
    )=>{

        e.preventDefault();


        if(!contentId){
            alert("Selecciona un contenido");
            return;
        }


        if(!backdropFile){
            alert("El banner es obligatorio");
            return;
        }


        const formData = new FormData();


        formData.append(
            "contentId",
            contentId.toString()
        );


        formData.append(
            "titleOverride",
            titleOverride
        );


        formData.append(
            "descriptionOverride",
            descriptionOverride
        );


        formData.append(
            "priority",
            priority.toString()
        );


        formData.append(
            "active",
            active.toString()
        );


        if(startDate)
            formData.append("startDate",startDate);


        if(endDate)
            formData.append("endDate",endDate);


        formData.append(
            "backdropFile",
            backdropFile
        );


        resetProgress();

        await addHeroBanner(
            formData,
            handleProgress
        );

    };

    return (
        <div className={layoutStyles.pageContainer}>
            <h1>Crear Banner</h1>
            <HeroBannerForm
                contentId={contentId}
                setContentId={setContentId}
                titleOverride={titleOverride}
                setTitleOverride={setTitleOverride}
                descriptionOverride={descriptionOverride}
                setDescriptionOverride={setDescriptionOverride}
                priority={priority}
                setPriority={setPriority}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                active={active}
                setActive={setActive}
                backdropFile={backdropFile}
                setBackdropFile={setBackdropFile}
                onSubmit={handleSubmit}
                saving={saving}
                
            />
        </div>
    )


}