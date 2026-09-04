import { AdminCinematicRoleApi } from "@/core/api/endpoints/AdminCinematicRoleApi";
import { CinematicRoleRequest, CinematicRoleResponse, Page, PaginationParams } from "@/entities/types";

export const cinematicRoleService = {

    getAll: async (
        params: PaginationParams,
        search?: string,
        signal?: AbortSignal
    ): Promise<Page<CinematicRoleResponse>> => {

        const response =
            await AdminCinematicRoleApi.getAll(
                params,
                search,
                { signal }
            );

        return response.data;
    },

    getById: async (
        cinematicRoleId: number,
        signal?: AbortSignal
    ): Promise<CinematicRoleResponse> => {

        const response =
            await AdminCinematicRoleApi.getById(
                cinematicRoleId,
                { signal }
            );

        return response.data;
    },

    create: async (
        data: CinematicRoleRequest,
        signal?: AbortSignal
    ): Promise<CinematicRoleResponse> => {

        const response =
            await AdminCinematicRoleApi.create(
                data,
                { signal }
            );

        return response.data;
    },

    update: async (
        cinematicRoleId: number,
        data: CinematicRoleRequest,
        signal?: AbortSignal
    ): Promise<CinematicRoleResponse> => {

        const response =
            await AdminCinematicRoleApi.update(
                cinematicRoleId,
                data,
                { signal }
            );

        return response.data;
    },

    delete: async (
        cinematicRoleId: number,
        signal?: AbortSignal
    ): Promise<void> => {

        await AdminCinematicRoleApi.delete(
            cinematicRoleId,
            { signal }
        );
    },
};