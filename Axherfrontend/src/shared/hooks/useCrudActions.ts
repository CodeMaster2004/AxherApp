"use client";

import { useCallback, useState } from "react";

type CrudService<TEntity, TCreate, TUpdate = Partial<TEntity>> = {
    create?: (data: TCreate) => Promise<TEntity>; 
    update?: (id: number, data: TUpdate) => Promise<TEntity>; 
    delete?: (id: number) => Promise<void>;
};

type Options<TEntity> = {
    onSuccess?: (result?: TEntity) => void;
    onError?: (error: unknown) => void;
};

export function useCrudActions<
    TEntity,
    TCreate,
    TUpdate = Partial<TEntity>
>(
    service: CrudService<TEntity, TCreate, TUpdate>,
    options?: Options<TEntity>
){
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState<number | null>(null);
    const [error, setError] = useState<unknown | null>(null);
    
    const add = useCallback(
        async (data: TCreate) => {
            if (!service.create) { throw new Error("Create operation is not supported"); }
            setSaving(true);
            setError(null);

            try {
                const created = await service.create(data);
                options?.onSuccess?.(created);
                return created;
            } catch (err) {
                setError(err);
                options?.onError?.(err);
                throw err;
            } finally {
                setSaving(false);
            }
        },
        [service, options]
    );

    const edit = useCallback(

        async (id: number, data: TUpdate) => {
            if (!service.update) { throw new Error("Update operation is not supported"); }
            setSaving(true);
            setError(null);

            try {
                const updated = await service.update(id, data);
                options?.onSuccess?.(updated);
                return updated;
            } catch (err) {
                setError(err);
                options?.onError?.(err);
                throw err;
            } finally {
                setSaving(false);
            }
        },
        [service, options]
    );

    const remove = useCallback(
        
        async (id: number) => {
            if (!service.delete) { throw new Error("Delete operation is not supported"); }
            setDeleting(id);
            setError(null);

            try {
                await service.delete(id);
                options?.onSuccess?.();
            } catch (err) {
                setError(err);
                options?.onError?.(err);
                throw err;
            } finally {
                setDeleting(null);
            }
        },
        [service, options]
    );

    return {
        saving,
        deleting,
        error,
        
        add,
        edit,
        remove
    };


}