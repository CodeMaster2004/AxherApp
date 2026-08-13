"use client";

import { useEffect, useState } from "react";
import { Shelf } from "@/entities/types";
import { shelfService } from "@/features/shelf/services/shelfService";

export const useShelf = (shelfId?: number) => {

    const [shelf, setShelf] = useState<Shelf | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        if (!shelfId) {
            setShelf(null);
            setLoading(false);
            return;
        }

        const controller = new AbortController();

        const load = async () => {

            try {

                setLoading(true);

                const data =
                    await shelfService.getByIdPublic(
                        shelfId,
                        controller.signal
                    );

                setShelf(data);

            } catch (error) {

                if (
                    error instanceof DOMException &&
                    error.name === "AbortError"
                ) {
                    return;
                }

                console.error(error);

            } finally {

                setLoading(false);

            }

        };

        load();

        return () => controller.abort();

    }, [shelfId]);

    return {
        shelf,
        loading
    };
};