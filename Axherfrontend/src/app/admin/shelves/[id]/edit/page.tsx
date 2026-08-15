"use client";

import { ContentShelf, ShelfLayout, ShelfSource, ShelfTarget } from "@/entities/types";
import { useShelfActions } from "@/features/shelf/hooks/useShelfActions";
import { shelfService } from "@/features/shelf/services/shelfService";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import ShelfForm from "@/features/shelf/components/ShelfForm";

export default function EditShelfPage() {

    const router = useRouter();
    const params = useParams();

    const id = params?.id 
        ? Number(params.id)
        : null;


    const [loading,setLoading] = useState(true);


    const [name,setName] = useState("");

    const [target,setTarget] = useState<ShelfTarget | undefined>();

    const [layout,setLayout] = useState<ShelfLayout | undefined>();

    const [source,setSource] = useState<ShelfSource | undefined>();
    const [active,setActive] = useState(true);

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
                setName(shelf.name);
                setTarget(shelf.target);
                setLayout(shelf.layout);
                setSource(shelf.source);
              
                setActive(
                    shelf.active
                );
            }catch(error){
                console.error(error);
                router.push("/admin/shelves");
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


        await editShelf(
            id,
            {
                name:name.trim(),
                target,
                layout,
                source,
                active
            }
        );


    };

    if(loading){

        return (
            <div className={layoutStyles.loading}>
                Cargando carrusel...
            </div>
        )

    }

    return (

        <div className={layoutStyles.pageContainer}>


            <h1>
                Editar Carrusel
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
                isEditing
                saving={saving}
                onCancel={()=>
                    router.push("/admin/shelves")
                }

            />


        </div>

    )



}