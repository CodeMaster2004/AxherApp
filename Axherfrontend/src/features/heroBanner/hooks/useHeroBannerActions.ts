import { HeroBanner } from "@/entities/types";
import { heroBannerService } from "@/features/heroBanner/services/heroBannerService";
import { AxiosProgressEvent } from "axios";
import { useCallback, useState } from "react";


type Options = {
    onSuccess?: (result?: HeroBanner) => void;
    onError?: (error: unknown) => void;
}


export const useHeroBannerActions = (options?: Options) => {

    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState<number | null>(null);
    const [toggling, setToggling] = useState<number | null>(null);
    const [error, setError] = useState<unknown | null>(null);


    const addHeroBanner = useCallback(
        async(
            formData: FormData,
            onUploadProgress?: (progressEvent: AxiosProgressEvent)=>void
        )=>{

            setSaving(true);
            setError(null);

            try{

                const created = await heroBannerService.create(
                    formData,
                    onUploadProgress
                );

                options?.onSuccess?.(created);

                return created;

            }catch(err){

                setError(err);

                options?.onError?.(err);

                throw err;

            }finally{

                setSaving(false);

            }

        },
        [options]
    );



    const editHeroBanner = useCallback(
        async(
            id:number,
            formData:FormData,
            onUploadProgress?: (progressEvent: AxiosProgressEvent)=>void
        )=>{

            setSaving(true);
            setError(null);

            try{

                const updated = await heroBannerService.update(
                    id,
                    formData,
                    onUploadProgress
                );

                options?.onSuccess?.(updated);

                return updated;

            }catch(err){

                setError(err);

                options?.onError?.(err);

                throw err;

            }finally{

                setSaving(false);

            }

        },
        [options]
    );



    const toggleHeroBanner = useCallback(
        async(id:number)=>{

            setToggling(id);
            setError(null);

            try{

                const updated = await heroBannerService.toggleActive(id);

                options?.onSuccess?.(updated);

                return updated;

            }catch(err){

                setError(err);

                options?.onError?.(err);

                throw err;

            }finally{

                setToggling(null);

            }

        },
        [options]
    );



    const removeHeroBanner = useCallback(
        async(id:number)=>{

            setDeleting(id);
            setError(null);

            try{

                await heroBannerService.delete(id);

                options?.onSuccess?.();

            }catch(err){

                setError(err);

                options?.onError?.(err);

                throw err;

            }finally{

                setDeleting(null);

            }

        },
        [options]
    );


    return {
        saving,
        deleting,
        toggling,
        error,

        addHeroBanner,
        editHeroBanner,
        toggleHeroBanner,
        removeHeroBanner
    }

}