"use client";

import { ShelfContent } from "@/entities/types";
import { shelfContentService } from "@/features/shelf/services/shelfContentService";
import { useCallback, useEffect, useState } from "react";


type Options = {
    initialData?: ShelfContent[];
    enabled?: boolean;
}


export const useShelfContents = (
    shelfId:number,
    options?:Options
) => {


    const [contents,setContents] = useState<ShelfContent[]>(
        options?.initialData ?? []
    );

    const [loading,setLoading] = useState(false);

    const [error,setError] = useState<unknown>(null);



    const fetchContents = useCallback(
        async()=>{

            setLoading(true);
            setError(null);

            try{

                const data = await shelfContentService.getAll(
                    shelfId
                );

                setContents(data);

            }catch(err){

                setError(err);

            }finally{

                setLoading(false);

            }

        },
        [shelfId]
    );



    useEffect(()=>{

        if(options?.enabled !== false){
            fetchContents();
        }

    },[fetchContents, options?.enabled]);



    return {

        contents,

        loading,

        error,

        refetch: fetchContents,

        setContents

    };

}