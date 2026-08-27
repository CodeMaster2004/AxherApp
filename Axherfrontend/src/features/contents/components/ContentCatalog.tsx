"use client";

import {
    ContentQueryParams,
    ContentType
} from "@/entities/types";

import {
    useEffect,
    useState
} from "react";

import { useCategory } from "@/features/contentCategories/hooks/useCategory";
import { useCatalogContents } from "@/features/contents/hooks/useCatalogContents";
import { useContentFilters } from "@/features/contents/hooks/useContentFilters";

import ContentFilter from "./ContentFilter";
import ContentGrid from "./ContentGrid";

import { useRouter } from "next/navigation";

import styles from "./ContentCatalog.module.css";
import { useTranslations } from "next-intl";


interface Props {
    slug:string;
    type:ContentType;
    basePath:string;
}



export default function ContentCatalog({
    slug,
    type,
    basePath
}:Props){


    const t = useTranslations("contents");
    const {
        category
    } = useCategory(slug);



    const [filters,setFilters] =
    useState<ContentQueryParams>({
        type,
        sort:"releaseDate,desc"
    });



    const {
        filters:availableFilters
    } = useContentFilters(type);



    const {
        contents,
        loading
    } = useCatalogContents({
        filters
    });



    const router = useRouter();



    useEffect(()=>{

        if(!category)
            return;


        setFilters(prev=>({
            ...prev,
            categoryId:category.contentCategoryId
        }));


    },[category]);

    const contentTypeLabel =
        type === ContentType.MOVIE
        ? t("filters.movies")
        : t("filters.series");


    return (

        <section className={styles.container}>


            <h1>
                {t("catalog.title", {
                    type: contentTypeLabel,
                    category: category?.name ?? ""
                })}

            </h1>



            <ContentFilter

                currentGenre={slug}

                genres={
                    availableFilters.categories
                }

                filters={filters}

                availableFilters={
                    availableFilters
                }

                onGenreChange={(newSlug)=>
                    router.push(
                        `${basePath}/genero/${newSlug}`
                    )
                }

                onChange={setFilters}

            />


            <ContentGrid
                contents={contents}
                loading={loading}
            />


        </section>

    )

}