"use client";

import { Page, PersonResponse, PaginationParams } from "@/entities/types";
import { personService } from "@/features/people/services/personService";
import { useCallback, useRef, useState, } from "react";

export function usePersonSelector() {
    const [people, setPeople] = useState<PersonResponse[]>([]);
    const [loading, setLoading] = useState(false);

    const abortControllerRef =
        useRef<AbortController | null>(null);

    const searchPeople = useCallback(
        async (value: string) => {
            const term = value.trim();

            if (!term) {
                setPeople([]);
                return;
            }

            abortControllerRef.current?.abort();

            const controller = new AbortController();

            abortControllerRef.current = controller;
            setLoading(true);

            try {
                const params: PaginationParams = {
                    page: 0,
                    size: 10,
                    sort: "firstName,asc",
                };

                const res = await personService.getAll(
                    params,
                    term,
                    controller.signal
                );

                if (!controller.signal.aborted) {
                    setPeople(res.content);
                }
            } catch (error) {
                if (
                    error instanceof DOMException &&
                    error.name === "AbortError"
                ) {
                    return;
                }

                throw error;
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        },
        []
    );

    const clearPeople = useCallback(() => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = null;

        setPeople([]);
        setLoading(false);
    }, []);

    return {
        people,
        loading,
        searchPeople,
        clearPeople,
    };
}