import { AdminCinematicRoleApi } from "@/core/api/endpoints/AdminCinematicRoleApi";
import { CinematicRoleAiTranslationRequest, CinematicRoleAiTranslationResponse, CinematicRoleTranslationRequest, CinematicRoleTranslationResponse } from "@/entities/types";

export const cinematicRoleTranslationService = {

    getAll: async (
        roleId: number,
        signal?: AbortSignal
    ): Promise<CinematicRoleTranslationResponse[]> => {

        const response =
            await AdminCinematicRoleApi.translations.getAll(
                roleId,
                { signal }
            );

        return response.data;
    },

    create: async (
        roleId: number,
        data: CinematicRoleTranslationRequest,
        signal?: AbortSignal
    ): Promise<CinematicRoleTranslationResponse> => {

        const response =
            await AdminCinematicRoleApi.translations.create(
                roleId,
                data,
                { signal }
            );

        return response.data;
    },

    update: async (
        roleId: number,
        languageId: number,
        data: CinematicRoleTranslationRequest,
        signal?: AbortSignal
    ): Promise<CinematicRoleTranslationResponse> => {

        const response =
            await AdminCinematicRoleApi.translations.update(
                roleId,
                languageId,
                data,
                { signal }
            );

        return response.data;
    },

    translateWithAi: async (
        roleId: number,
        sourceLanguageId: number,
        data: CinematicRoleAiTranslationRequest,
        signal?: AbortSignal
    ): Promise<CinematicRoleAiTranslationResponse> => {

        const response =
            await AdminCinematicRoleApi.translations.translateWithAi(
                roleId,
                sourceLanguageId,
                data,
                { signal }
            );

        return response.data;
    },

    delete: async (
        roleId: number,
        languageId: number,
        signal?: AbortSignal
    ): Promise<void> => {

        await AdminCinematicRoleApi.translations.delete(
            roleId,
            languageId,
            { signal }
        );
    },
};