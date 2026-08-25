"use client";

import { CreateShelf, ShelfLayout, ShelfSource, ShelfTarget } from "@/entities/types";
import ShelfForm from "@/features/shelf/components/ShelfForm";
import { useShelfActions } from "@/features/shelf/hooks/useShelfActions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import { useLanguage } from "@/features/language/hooks/useLanguage";
import { useTranslations } from "next-intl";

export default function CreateShelfPage() {

    const router = useRouter();

    const t = useTranslations("shelves");
    const [error, setError] = useState("");
    const {
        addShelf,
        saving
    } = useShelfActions({
        onSuccess:()=>router.push("/admin/shelves")
    });

    const {languages, loading: languagesLoading} = useLanguage();

    const [form, setForm] = useState<CreateShelf>({
        name:"",
        target:ShelfTarget.HOME,
        layout:ShelfLayout.POSTER,
        source:ShelfSource.MANUAL,
        active:true,
        languageId:0
    })

    const handleSubmit = async(
        e:React.FormEvent<HTMLFormElement>
    )=>{

        e.preventDefault();

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


        await addShelf({
            name: nameTrim,
            target: form.target,
            layout: form.layout,
            source: form.source,
            active: form.active,
            languageId: form.languageId
        });

    };

    const handleCancel = () => {
            router.push("/admin/shelves");
        };

    return (

        <div className={layoutStyles.pageContainer}>

            <h1>
                {t("create")}
            </h1>


            <ShelfForm

                value={form}
                onChange={(value) => {
                    setForm(value);
                    if (error) {
                        setError("");
                    }
                }}
                languages={languages}
                onSubmit={handleSubmit}
                isEditing={false}
                onCancel={handleCancel}
                saving={saving || languagesLoading}
                error={error || undefined}

            />


        </div>

    )

}