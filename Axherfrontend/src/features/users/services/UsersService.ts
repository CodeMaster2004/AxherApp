import { userPreferencesApi } from "@/core/api/endpoints/userPreferencesApi";
import { usersApi } from "@/core/api/endpoints/UsersApi";
import { Page, PaginationParams, UpdateUserPreferencesRequest, UserList } from "@/entities/types";
import { AxiosResponse } from "axios";

export const usersService = {

    getAll: (
            params: PaginationParams,
            search?: string,
            signal?: AbortSignal
        ): Promise<Page<UserList>> =>
            usersApi.getAll(params, search, { signal })
                .then((res: AxiosResponse<Page<UserList>>) => res.data),
            
    checkEmail: async (email: string): Promise<boolean> => {
        const res = await usersApi.checkEmail(email);
        return res.data.exists;
    },

    updatePreferences: (
        request: UpdateUserPreferencesRequest,
        signal?: AbortSignal
    ): Promise<void> =>
        userPreferencesApi.updatePreferences(request, { signal })
            .then((res: AxiosResponse<void>) => res.data),
    
}