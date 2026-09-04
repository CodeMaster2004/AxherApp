"use client";

import { ContentPersonRoleCreateRequest, ContentPersonRoleResponse, ContentPersonRoleUpdateRequest, } from "@/entities/types";
import { contentPersonRoleService } from "@/features/people/services/contentPersonRoleService";
import { useCallback, useState } from "react";

type Options = {
    onSuccess?: (result?: ContentPersonRoleResponse) => void;
    onError?: (error: unknown) => void;
};

export const useContentPersonRoleActions = (
    options?: Options
) => {
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState<number | null>(null);
    const [moving, setMoving] = useState<number | null>(null);
    const [error, setError] = useState<unknown | null>(null);

    const addContentPersonRole = useCallback(
        async (
            contentId: number,
            data: ContentPersonRoleCreateRequest
        ) => {
            setSaving(true);
            setError(null);

            try {
                const created =
                    await contentPersonRoleService.create(
                        contentId,
                        data
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

    const editContentPersonRole = useCallback(
        async (
            contentId: number,
            contentPersonRoleId: number,
            data: ContentPersonRoleUpdateRequest
        ) => {
            setSaving(true);
            setError(null);

            try {
                const updated =
                    await contentPersonRoleService.update(
                        contentId,
                        contentPersonRoleId,
                        data
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

    const removeContentPersonRole = useCallback(
        async (
            contentId: number,
            contentPersonRoleId: number
        ) => {
            setDeleting(contentPersonRoleId);
            setError(null);

            try {
                await contentPersonRoleService.delete(
                    contentId,
                    contentPersonRoleId
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

    const moveContentPersonRole = useCallback(
        async (
            contentId: number,
            contentPersonRoleId: number,
            orderIndex: number
        ) => {
            setMoving(contentPersonRoleId);
            setError(null);

            try {
                const updated =
                    await contentPersonRoleService.update(
                        contentId,
                        contentPersonRoleId,
                        {
                            orderIndex,
                        }
                    );

                options?.onSuccess?.(updated);

                return updated;
            } catch (err) {
                setError(err);
                options?.onError?.(err);
                throw err;
            } finally {
                setMoving(null);
            }
        },
        [options]
    );

    return {
        saving,
        deleting,
        moving,
        error,
        addContentPersonRole,
        editContentPersonRole,
        removeContentPersonRole,
        moveContentPersonRole,
    };
};