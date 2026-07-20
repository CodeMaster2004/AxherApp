import { ContentDetail, StatusUpdate } from "@/entities/types";
import { contentService } from "@/features/contents/services/ContentService";
import { AxiosProgressEvent } from "axios";
import { useCallback, useState } from "react";


type Options = {
    onSuccess?: (result?: ContentDetail) => void;
    onError?: (error: unknown) => void;
}

export const useContentsActions = (options?: Options) => {
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState<number | null>(null);
    const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);
    const [error, setError] = useState<unknown | null>(null);

    const addContent = useCallback(
        async (formData: FormData, onUploadProgress?: (progressEvent: AxiosProgressEvent) => void) =>{
            setSaving(true);
            setError(null);

            try{
                const created = await contentService.create(formData, onUploadProgress);
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

    const editContent = useCallback(
        async (id: number, formData: FormData, onUploadProgress?: (progressEvent: AxiosProgressEvent) => void) => {
            setSaving(true);
            setError(null);

            try{
                const updated = await contentService.update(id, formData, onUploadProgress);
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

    const removeContent = useCallback(
        async (id: number) => {
            setDeleting(id);
            setError(null);

            try{
                await contentService.delete(id);
                options?.onSuccess?.();
            }catch(err) {
                setError(err);
                options?.onError?.(err);
                throw err;
            }finally{
                setDeleting(null);
            }
        },
        [options]
    );

    const updateContentStatus = useCallback(
        async (id: number, statusUpdate: StatusUpdate) => {
            setUpdatingStatus(id);
            setError(null);

            try{
                const updated = await contentService.updateStatus(id, statusUpdate);
                options?.onSuccess?.(updated);
                return updated;
            }catch(err){
                setError(err);
                options?.onError?.(err);
                throw err;
            }finally{
                setUpdatingStatus(null);
            }
        },
        [options]
    );

    return {
        saving,
        deleting,
        updatingStatus,
        error,
        addContent,
        editContent,
        removeContent,
        updateContentStatus,
    };
};