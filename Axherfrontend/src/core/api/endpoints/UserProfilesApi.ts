import { UpdateUserProfile, UserProfile } from "@/entities/types";
import { AxiosRequestConfig } from "axios";
import axiosClient from "../axiosClient";

export const userProfilesApi = {

    getById:(profileId: number, config?: AxiosRequestConfig) =>
        axiosClient.get<UserProfile>(`/profiles/${profileId}`, config),

    getByUserId: (userId: number, config?: AxiosRequestConfig) => 
        axiosClient.get<UserProfile>(`/profiles/user/${userId}`, config),

    update: (profileId: number, updateProfile: UpdateUserProfile | FormData, config?: AxiosRequestConfig) =>
        axiosClient.patch<UserProfile>(`/profiles/${profileId}`, updateProfile, {
            headers: {"Content-type": "multipart/form-data"},
            ...config
        }),
}