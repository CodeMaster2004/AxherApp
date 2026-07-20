"use client";

import { popularityService } from "@/features/popularity/services/popularityService";
import { useCallback, useState } from "react";

export const usePopularity = () => {

    const [loading, setLoading] = useState(false);

    const getContentFeatured = useCallback(async() => {
        setLoading(true);

        try {
            return await popularityService.contentFeatured();
        }finally{
            setLoading(false);
        }
    },[]);

    const getTrending = useCallback(async() => {

        setLoading(true);

        try {

            const data = await popularityService.trending();
            return data.content;
        }finally{
            setLoading(false);
        }
    },[]);

    const getMovies = useCallback(async() => {
        setLoading(true);

        try {
            const data = await popularityService.movies();
            return data.content;
        }finally{
            setLoading(false);
        }
    },[]);

    const getSeries = useCallback(async() => {
        setLoading(true);

        try{
            const data = await popularityService.series();
            return data.content;
        }finally{
            setLoading(true);
        }
    },[]);

    return {
        loading,
        getContentFeatured,
        getTrending,
        getMovies,
        getSeries
    };
};