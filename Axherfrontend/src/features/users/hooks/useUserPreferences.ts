"use client";

import { UpdateUserPreferencesRequest } from "@/entities/types";
import { usersService } from "@/features/users/services/UsersService";
import { useState } from "react";

export function useUserPreferences() {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const updatePreferences = async (
        request: UpdateUserPreferencesRequest
    ) => {

        try {
            setLoading(true);
            setError(null);

            await usersService.updatePreferences(request);

        } catch (err) {

            const error =
                err instanceof Error
                    ? err
                    : new Error("Error al actualizar las preferencias");

            setError(error);

            throw error;

        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        updatePreferences,
    };
}