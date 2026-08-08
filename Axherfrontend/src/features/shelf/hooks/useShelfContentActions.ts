"use client";

import { CreateShelfContent, UpdateShelfContent } from "@/entities/types";
import { shelfContentService } from "@/features/shelf/services/shelfContentService";
import { useCallback, useState } from "react";

type Options = {
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
}

export const useShelfContentActions = (options?: Options) => {
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState<number | null>(null);
    const [error, setError] = useState<unknown | null>(null);

    const addContent = useCallback(
        async(
            shelfId:number,
            data: CreateShelfContent
        ) => {
            setSaving(true);
            setError(null);

            try{
                await shelfContentService.addContent(shelfId, data);
                options?.onSuccess?.();
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

    const updatePosition = useCallback(
        async(
            shelfId:number,
            shelfContentId:number,
            data: UpdateShelfContent
        ) => {
            setSaving(true);
            setError(null);

            try{
                await shelfContentService.updatePosition(shelfId, shelfContentId, data);
                options?.onSuccess?.();
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

    const removeContent = useCallback(
        async(
            shelfId:number,
            shelfContentId:number
        ) => {
            setDeleting(shelfContentId);
            setError(null);

            try{
                await shelfContentService.delete(shelfId, shelfContentId);
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
        error,

        addContent,
        updatePosition,
        removeContent
    }
        
        
    
}