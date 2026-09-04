"use client";

import { PersonResponse } from "@/entities/types";
import { personService } from "@/features/people/services/personService";
import { AxiosProgressEvent } from "axios";
import { useCallback, useState } from "react";

type Options = {
    onSuccess?: (result?: PersonResponse) => void;
    onError?: (error: unknown) => void;
};

export const usePersonActions = (
    options?: Options
) => {

    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState<number | null>(null);
    const [error, setError] = useState<unknown | null>(null);

    const addPerson = useCallback(
        async (
            formData: FormData,
            onUploadProgress?: (
                progressEvent: AxiosProgressEvent
            ) => void
        ) => {

            setSaving(true);
            setError(null);

            try {

                const created =
                    await personService.create(
                        formData,
                        onUploadProgress
                    );

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
        [options]
    );

    const editPerson = useCallback(
        async (
            personId: number,
            formData: FormData,
            onUploadProgress?: (
                progressEvent: AxiosProgressEvent
            ) => void
        ) => {

            setSaving(true);
            setError(null);

            try {

                const updated =
                    await personService.update(
                        personId,
                        formData,
                        onUploadProgress
                    );

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
        [options]
    );

    const removePerson = useCallback(
        async (
            personId: number
        ) => {

            setDeleting(personId);
            setError(null);

            try {

                await personService.delete(
                    personId
                );

                options?.onSuccess?.();

            } catch (err) {

                setError(err);
                options?.onError?.(err);
                throw err;

            } finally {

                setDeleting(null);

            }

        },
        [options]
    );

    return {
        saving,
        deleting,
        error,

        addPerson,
        editPerson,
        removePerson,
    };
};