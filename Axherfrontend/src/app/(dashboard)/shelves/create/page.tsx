"use client";

import { ShelfLayout, ShelfSource, ShelfTarget } from "@/entities/types";
import ShelfForm from "@/features/shelf/components/ShelfForm";
import { useShelfActions } from "@/features/shelf/hooks/useShelfActions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";

export default function CreateShelfPage() {

    const router = useRouter();

    const [name,setName] = useState("");

    const [target,setTarget] = useState<ShelfTarget>(
        ShelfTarget.HOME
    );

    const [layout,setLayout] = useState<ShelfLayout>(
        ShelfLayout.POSTER
    );
    const [source,setSource] = useState<ShelfSource>(
        ShelfSource.MANUAL
    );
    const [active,setActive] = useState(true);

    const {
        addShelf,
        saving
    } = useShelfActions({
        onSuccess:()=>router.push("/shelves")
    });

    const handleSubmit = async(
        e:React.FormEvent<HTMLFormElement>
    )=>{

        e.preventDefault();


        if(!target || !layout){
            return;
        }


        await addShelf({
            name,
            target,
            layout,
            source,
            active
        });

    };

    return (

        <div className={layoutStyles.pageContainer}>

            <h1>
                Crear Carrusel
            </h1>


            <ShelfForm

                name={name}
                target={target}
                layout={layout}
                source={source}
                active={active}
                setName={setName}
                setTarget={setTarget}
                setLayout={setLayout}
                setSource={setSource}
                setActive={setActive}
                onSubmit={handleSubmit}
                saving={saving}
                onCancel={()=>router.push("/shelves")}

            />


        </div>

    )

}