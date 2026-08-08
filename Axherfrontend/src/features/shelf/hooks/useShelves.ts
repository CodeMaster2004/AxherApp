"use client";

import { useEffect, useState } from "react";
import { Shelf } from "@/entities/types";
import { shelfService } from "@/features/shelf/services/shelfService";


export const useShelves = (
    target:string,
    slug?:string
)=>{

    const [shelves,setShelves] = useState<Shelf[]>([]);
    const [loading,setLoading] = useState(true);


    useEffect(()=>{

        const controller = new AbortController();


        const load = async()=>{

            try{

                const data =
                    await shelfService.getByTarget(
                        target,
                        slug,
                        controller.signal
                    );

                setShelves(data);

            }catch(error){

                if(error instanceof DOMException &&
                    error.name === "AbortError")
                    return;

                console.error(error);

            }finally{
                setLoading(false);
            }

        };


        load();


        return ()=>controller.abort();


    },[target]);


    return {
        shelves,
        loading
    };

}