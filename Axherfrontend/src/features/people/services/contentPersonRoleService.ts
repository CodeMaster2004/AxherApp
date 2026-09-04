import { AdminContentPersonRoleApi } from "@/core/api/endpoints/AdminContentPersonRoleApi";
import { contentPersonRoleApi } from "@/core/api/endpoints/contentPersonRoleApi";
import { ContentPersonRoleCreateRequest, ContentPersonRoleResponse, ContentPersonRoleUpdateRequest, Page, PaginationParams } from "@/entities/types";

export const contentPersonRoleService = {

    getAll: async (
        contentId: number,
        params: PaginationParams,
        search?: string,
        signal?: AbortSignal
    ): Promise<Page<ContentPersonRoleResponse>> => {
        const response =
            await AdminContentPersonRoleApi.getAll(
                contentId,
                params,
                search,
                { signal }
            );

        return response.data;
    },

    getById: async (
        contentId: number,
        contentPersonRoleId: number,
        signal?: AbortSignal
    ): Promise<ContentPersonRoleResponse> => {

        const response =
            await AdminContentPersonRoleApi.getById(
                contentId,
                contentPersonRoleId,
                { signal }
            );

        return response.data;
    },

    create: async (
        contentId: number,
        data: ContentPersonRoleCreateRequest,
        signal?: AbortSignal
    ): Promise<ContentPersonRoleResponse> => {

        const response =
            await AdminContentPersonRoleApi.create(
                contentId,
                data,
                { signal }
            );

        return response.data;
    },

    update: async (
        contentId: number,
        contentPersonRoleId: number,
        data: ContentPersonRoleUpdateRequest,
        signal?: AbortSignal
    ): Promise<ContentPersonRoleResponse> => {

        const response =
            await AdminContentPersonRoleApi.update(
                contentId,
                contentPersonRoleId,
                data,
                { signal }
            );

        return response.data;
    },

    delete: async (
        contentId: number,
        contentPersonRoleId: number,
        signal?: AbortSignal
    ): Promise<void> => {

        await AdminContentPersonRoleApi.delete(
            contentId,
            contentPersonRoleId,
            { signal }
        );
    },

    getByContent: async (
        contentId: number,
        signal?: AbortSignal
    ): Promise<ContentPersonRoleResponse[]> => {
        const response = await contentPersonRoleApi.getByContent(
            contentId,
            { signal }
        );

        return response.data;
    },
};