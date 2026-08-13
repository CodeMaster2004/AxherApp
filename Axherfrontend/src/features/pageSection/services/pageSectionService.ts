import { adminPageSectionApi } from "@/core/api/endpoints/AdminPageSectionApi";
import { pageSectionApi } from "@/core/api/endpoints/pageSectionApi";
import { PageSection, PageSectionCreate, PageSectionUpdate, PageType } from "@/entities/types/pageSection.types";

export const pageSectionService = {

    getByPage: async(
        page: string,
        signal?: AbortSignal
    ): Promise<PageSection[]> => {

        const res = await pageSectionApi.getByPage(
            page,
            {
                signal
            }
        );
        return res.data;
    },

    getAllByPage: async(
        page: PageType,
        signal?: AbortSignal
    ): Promise<PageSection[]> => {

        const res = await adminPageSectionApi.getAllByPage(
            page,
            {
                signal
            }
        );

        return res.data;
    },

    getById: async (
        id: number,
        signal?: AbortSignal
    ): Promise<PageSection> => {

        const res = await adminPageSectionApi.getById(
            id,
            {
                signal
            }
        );

        return res.data;
    },

    create: async(
        data: PageSectionCreate,
        signal?: AbortSignal
    ): Promise<PageSection> => {
        const res = await adminPageSectionApi.create(
            data,
            {
                signal
            }
        );
        return res.data;
    },

    update: async (
        id: number,
        data: Partial<PageSectionUpdate>,
        signal?: AbortSignal
    ): Promise<PageSection> => {

        const res = await adminPageSectionApi.update(
            id,
            data,
            {
                signal
            }
        );

        return res.data;
    },

    delete: async (
        id: number,
        signal?: AbortSignal
    ): Promise<void> => {

        await adminPageSectionApi.delete(
            id,
            {
                signal
            }
        );
    },

    toggleActive: async(
            id:number,
            signal?:AbortSignal
        ):Promise<PageSection> => {
            const res = await adminPageSectionApi.toggleActive(
                id,
                {
                    signal
                }
            );
            return res.data;
        },
}