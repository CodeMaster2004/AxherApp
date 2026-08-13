"use client";

import { ShelfOption, ShelfTarget } from "@/entities/types";
import { shelfService } from "@/features/shelf/services/shelfService";
import axios from "axios";
import { useEffect, useState } from "react";

export const useShelfOptions = (
    target?: ShelfTarget
) => {

    const [options, setOptions] = useState<ShelfOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {

        if (!target) {
            setOptions([]);
            setLoading(false);
            return;
        }

        const controller = new AbortController();

        const load = async () => {

            try {

                setLoading(true);
                setError(null);

                const data =
                    await shelfService.getOptions(
                        target,
                        controller.signal
                    );

                setOptions(data);

            } catch (error) {

                // Cancelación normal del request.
                if (axios.isCancel(error)) {
                    return;
                }

                setError(error);

                console.error(
                    "Error cargando opciones de shelves:",
                    error
                );

            } finally {

                setLoading(false);

            }

        };

        load();

        return () =>
            controller.abort();

    }, [target]);

    return {
        options,
        loading,
        error
    };
};