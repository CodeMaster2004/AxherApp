"use client";

import { ContentCategoryResponse, ContentFilters, ContentFiltersDto, ContentQueryParams } from "@/entities/types";
import Dropdown from "@/shared/components/ui/Dropdown";
import styles from "./ContentFilter.module.css";
import { useTranslations } from "next-intl";

interface Props {
    currentGenre: string;
    genres: ContentCategoryResponse[];
    filters: ContentQueryParams;
    availableFilters?: ContentFiltersDto;
    onGenreChange: (slug: string) => void;
    onChange: (filters: ContentQueryParams) => void;
}



export default function ContentFilter({
    currentGenre,
    genres,
    filters,
    availableFilters,
    onGenreChange,
    onChange
}: Props){

    const t = useTranslations("contents");

    const handleChange = (
        field: keyof ContentFilters,
        value: string
    ) => {

        onChange({
            ...filters,
            [field]: value ? Number(value) : undefined
        });

    };

    const sortOptions = [
        {
            value: "releaseDate,desc",
            label: t("filters.sortRecent")
        },
        {
            value: "title,asc",
            label: t("filters.sortAZ")
        },
        {
            value: "title,desc",
            label: t("filters.sortZA")
        },
    ];

    

    return (
        <section className={styles.container}>

        <Dropdown
            width={220}
            value={
                genres.find(
                    genre => genre.slug === currentGenre
                )
            }
            items={genres}
            getValue={genre => genre.slug}
            getLabel={genre => genre.name}
            onChange={(genre)=>{

    if(!genre) return;

    onGenreChange(genre.slug);

}}
            placeholder={t("filters.allGenres")}
        />
        
        <div className={styles.rightFilters}>
            <Dropdown
                width={180}
                value={filters.year ?? null}
                items={[
                    null,
                    ...(availableFilters?.years ?? []),
                ]}
                getValue={(year) => 
                    year?.toString() ?? ""
                }
                getLabel={(year) =>
                    year?.toString() ?? t("filters.allYears")
                }
                onChange={(year) =>
                    handleChange("year", year?.toString() ?? "")
                }
            />

            <Dropdown
                width={200}
                value={
                    sortOptions.find(
                        option => 
                            option.value ===
                        (
                            filters.sort ??
                            "releaseDate,desc"
                        )
                    )
                }
                items={sortOptions}
                getValue={option => option.value}
                getLabel={option => option.label}
                onChange={(option) =>
                    onChange({
                        ...filters,
                        sort: option.value
                    })
                }
            />
        </div>

    </section>
    )
}