"use client";

import { ContentShelf, CreateShelf, ShelfLayout, ShelfSource, ShelfTarget} from "@/entities/types";
import { useShelfActions } from "@/features/shelf/hooks/useShelfActions";
import { shelfService } from "@/features/shelf/services/shelfService";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import ShelfForm from "@/features/shelf/components/ShelfForm";
import { useLanguage } from "@/features/language/hooks/useLanguage";
import { useTranslations } from "next-intl";

export default function EditShelfPage() {

    const router = useRouter();
    const params = useParams();
    const id = params?.id 
        ? Number(params.id)
        : null;

    const [loading,setLoading] = useState(true);
    const [error,setError] = useState("");
    const t = useTranslations("shelves");

    const {
        languages,
        loading: languagesLoading,
    } = useLanguage();

    const [form, setForm] = useState<CreateShelf>({
        name:"",
        target:ShelfTarget.HOME,
        layout:ShelfLayout.POSTER,
        source:ShelfSource.MANUAL,
        active:true,
        languageId: 0
    })


    const {
        editShelf,
        saving
    } = useShelfActions({
        onSuccess:()=>router.push("/admin/shelves")
    });

    useEffect(()=>{

        if(!id){
            router.push("/admin/shelves");
            return;
        }
        const load = async()=>{

            try{

                const shelf:ContentShelf =
                    await shelfService.getById(id);
                setForm({
                    name:shelf.name,
                    target:shelf.target,
                    layout:shelf.layout,
                    source:shelf.source,
                    active:shelf.active,
                    languageId: shelf.languageId,
                });
            }catch(error){
                console.error(error);
                router.push("/admin/shelves");
                setError(t("error.load"));
            }finally{
                setLoading(false);
            }

        };
        
        load();

    },[id,router]);

    const handleSubmit = async(
        e:React.FormEvent<HTMLFormElement>
    )=>{

        e.preventDefault();


        if(!id)return;

        const nameTrim = form.name.trim();

        if (!nameTrim) {
            setError(t("validation.nameRequired"));
            return;
        }
       
        if (!form.languageId) {
            setError(t("validation.languageRequired"));
            return;
        }

        if (!form.target) {
            setError(t("validation.targetRequired"));
            return;
        }

        if (!form.layout) {
            setError(t("validation.layoutRequired"));
            return;
        }

        if (!form.source) {
            setError(t("validation.sourceRequired"));
            return;
        }



        await editShelf(
            id,
            {
                name: nameTrim,
                target: form.target,
                layout: form.layout,
                source: form.source,
                active: form.active,
                languageId: form.languageId
            }
        );


    };
    const handleCancel = () => {
        router.push("/admin/shelves");
    };

    if(loading){

        return (
            <div className={layoutStyles.loading}>
                {t("loading")}
            </div>
        )

    }

    return (

        <div className={layoutStyles.pageContainer}>


            <h1>
                {t("edit")}
            </h1>


            <ShelfForm
                value={form}
                onChange={(value)=>{
                    setForm(value);
                    if(error){
                        setError("");
                    }
                }}
                languages={languages}
                onSubmit={handleSubmit}
                isEditing={true}
                saving={saving || languagesLoading}
                error={error || undefined}
                onCancel={handleCancel}
            />


        </div>

    )



}