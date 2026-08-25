"use client";

import { ContentCategoryResponse, ContentFilters, ContentFiltersDto, ContentQueryParams } from "@/entities/types";
import Dropdown from "@/shared/components/ui/Dropdown";
import styles from "./ContentFilter.module.css";

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
            label: "Más recientes"
        },
        {
            value: "title,asc",
            label: "A-Z"
        },
        {
            value: "title,desc",
            label: "Z-A"
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
            placeholder="Todos los géneros"
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
                    year?.toString() ?? "Todos los años"
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