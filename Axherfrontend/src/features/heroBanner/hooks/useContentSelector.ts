"use client";

import {
    ContentDetail,
    SearchParams
} from "@/entities/types";

import {
    contentService
} from "@/features/contents/services/ContentService";

import {
    useCallback,
    useRef,
    useState
} from "react";


export function useContentSelector() {

    const [contents, setContents] =
        useState<ContentDetail[]>([]);

    const [loading, setLoading] =
        useState(false);

    const abortControllerRef =
        useRef<AbortController | null>(null);


    const searchContents = useCallback(
        async (value: string) => {

            const term = value.trim();

            if (!term) {
                setContents([]);
                return;
            }


            // Cancela la búsqueda anterior.
            abortControllerRef.current?.abort();

            const controller =
                new AbortController();

            abortControllerRef.current =
                controller;

            setLoading(true);


            try {

                const params: SearchParams = {

                    page: 0,

                    size: 10,

                    sort: "title,asc",

                    // IMPORTANTE:
                    // globalSearch utiliza "q", no "title".
                    q: term

                };


                const res =
                    await contentService.searchGlobal(
                        params,
                        controller.signal
                    );


                if (!controller.signal.aborted) {

                    setContents(res.content);

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


    const clearContents = useCallback(() => {

        abortControllerRef.current?.abort();

        abortControllerRef.current = null;

        setContents([]);

        setLoading(false);

    }, []);


    return {
        contents,
        loading,
        searchContents,
        clearContents
    };
}