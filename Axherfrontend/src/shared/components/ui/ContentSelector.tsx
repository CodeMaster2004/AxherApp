"use client";

import { ContentDetail } from "@/entities/types";
import { contentService } from "@/features/contents/services/ContentService";
import { useContentSelector } from "@/features/heroBanner/hooks/useContentSelector";
import Input from "@/shared/components/ui/Input";
import { useDebounce } from "@/shared/hooks/useDebounce";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./ContentSelector.module.css";

interface Props {
    value?: number;
    onChange: (id: number) => void;
}

export default function ContentSelector({
    value,
    onChange
}: Props) {

    const {
        contents,
        loading,
        searchContents,
        clearContents
    } = useContentSelector();

    const [
        selected,
        setSelected
    ] = useState<ContentDetail | null>(null);

    const [
        search,
        setSearch
    ] = useState("");

    const debouncedSearch =
        useDebounce(search, 500);


    useEffect(() => {

        const term =
            debouncedSearch.trim();

        if (!term) {

            clearContents();

            return;
        }

        searchContents(term);

    }, [
        debouncedSearch,
        clearContents,
        searchContents
    ]);


    useEffect(() => {

        if (value == null) {

            setSelected(null);

            return;
        }

        let cancelled = false;

        contentService
            .getById(value)
            .then(data => {

                if (!cancelled) {
                    setSelected(data);
                }

            });

        return () => {
            cancelled = true;
        };

    }, [value]);


    const handleSelect = (
        content: ContentDetail
    ) => {

        setSelected(content);

        onChange(content.contentId);

        setSearch("");

        clearContents();
    };


    return (

        <div className={styles.wrapper}>

            {
                selected && (

                    <div className={styles.selected}>

                        <div className={styles.selectedPoster}>

                            {
                                selected.posterUrl && (

                                    <Image
                                        src={selected.posterUrl}
                                        alt={selected.title}
                                        width={55}
                                        height={80}
                                    />

                                )
                            }

                        </div>

                        <div className={styles.selectedInfo}>

                            <span className={styles.selectedLabel}>
                                Contenido seleccionado
                            </span>

                            <strong>
                                {selected.title}
                            </strong>

                            <div className={styles.meta}>

                                <span>
                                    {
                                        selected.type === "MOVIE"
                                            ? "Película"
                                            : "Serie"
                                    }
                                </span>

                                <span>
                                    {
                                        new Date(
                                            selected.releaseDate
                                        ).getFullYear()
                                    }
                                </span>

                            </div>

                        </div>

                    </div>

                )
            }


            <div className={styles.searchBox}>

                <Input
                    label="Buscar contenido"
                    value={search}
                    placeholder="Ej: Batman, Avatar..."
                    onChange={setSearch}
                />

            </div>


            {
                loading && (

                    <div className={styles.loading}>
                        Buscando...
                    </div>

                )
            }


            {
                contents.length > 0 && (

                    <div className={styles.results}>

                        {
                            contents.map(content => (

                                <article
                                    key={content.contentId}
                                    className={styles.resultItem}
                                    onClick={() =>
                                        handleSelect(content)
                                    }
                                >

                                    {
                                        content.posterUrl && (

                                            <Image
                                                src={content.posterUrl}
                                                alt={content.title}
                                                width={55}
                                                height={80}
                                                className={styles.poster}
                                            />

                                        )
                                    }


                                    <div className={styles.info}>

                                        <h3>
                                            {content.title}
                                        </h3>

                                        <div className={styles.meta}>

                                            <span>
                                                {
                                                    content.type === "MOVIE"
                                                        ? "Película"
                                                        : "Serie"
                                                }
                                            </span>

                                            <span>
                                                {
                                                    new Date(
                                                        content.releaseDate
                                                    ).getFullYear()
                                                }
                                            </span>

                                        </div>

                                    </div>

                                </article>

                            ))
                        }

                    </div>

                )
            }


            {
                !loading &&
                debouncedSearch.trim() !== "" &&
                contents.length === 0 && (

                    <div className={styles.empty}>

                        No encontramos resultados

                    </div>

                )
            }

        </div>
    );
}