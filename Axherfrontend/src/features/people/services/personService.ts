import { AdminPersonApi } from "@/core/api/endpoints/AdminPersonApi";
import { Page, PaginationParams, PersonResponse } from "@/entities/types";
import { AxiosProgressEvent } from "axios";

export const personService = {

    getAll: async (
        params: PaginationParams,
        search?: string,
        signal?: AbortSignal
    ): Promise<Page<PersonResponse>> => {

        const res = await AdminPersonApi.getAll(
            params,
            search,
            { signal }
        );

        return res.data;
    },

    getById: async (
        personId: number,
        signal?: AbortSignal
    ): Promise<PersonResponse> => {

        const res = await AdminPersonApi.getById(
            personId,
            { signal }
        );

        return res.data;
    },

    create: async (
        formData: FormData,
        onUploadProgress?: (
            progressEvent: AxiosProgressEvent
        ) => void,
        signal?: AbortSignal
    ): Promise<PersonResponse> => {

        const res = await AdminPersonApi.create(
            formData,
            {
                signal,
                onUploadProgress,
            }
        );

        return res.data;
    },

    update: async (
        personId: number,
        formData: FormData,
        onUploadProgress?: (
            progressEvent: AxiosProgressEvent
        ) => void,
        signal?: AbortSignal
    ): Promise<PersonResponse> => {

        const res = await AdminPersonApi.update(
            personId,
            formData,
            {
                signal,
                onUploadProgress,
            }
        );

        return res.data;
    },

    delete: async (
        personId: number,
        signal?: AbortSignal
    ): Promise<void> => {

        await AdminPersonApi.delete(
            personId,
            { signal }
        );
    },
};