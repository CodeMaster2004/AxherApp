"use client";

import { X } from "lucide-react";
import { useState } from "react";
import styles from "./Search.module.css"
import { useGlobalSearch } from "@/features/search/hooks/UseGlobalSearch";
import { useRouter } from "next/navigation";
import { ContentDetail } from "@/entities/types";
import Image from "next/image";
import { useDebounce } from "@/shared/hooks/useDebounce";

interface Props {
    onClose: () => void;
}

export default function SearchModal({ onClose }: Props) {

    const [query, setQuery] = useState("");
    const debouncedQuery = useDebounce(query, 500);
    const { results, loading } = useGlobalSearch(debouncedQuery.trim());
    const router = useRouter();


    const handleSelect = (item: ContentDetail) => {

        onClose();

        if(item.type === "MOVIE") {
            router.push(`/peliculas/${item.contentId}`);
        }

        if(item.type === "SERIE") {
            router.push(`/serie/${item.contentId}`);
        }
    }
    return (
        <div 
            className={styles.overlay}
            onClick={onClose}
        >
            <div 
                className={styles.container}
                onClick={(e)=>e.stopPropagation()}
            
            >
                <button
                    onClick={onClose}
                    className={styles.close}
                >
                    <X/>
                </button>

                <input
                    autoFocus
                    value={query}
                    onChange={
                        e=>setQuery(e.target.value)
                    }
                    placeholder="Buscar peliculas o series..."
                />

                {
                    loading && (
                        <div className={styles.loading}>
                            Buscando...
                        </div>
                    )
                }

                

                {
                    results.length > 0 && (
                        <div className={styles.results}>

                            {
                                results.map((item)=>(
                                    <article 
                                        key={item.contentId}
                                        onClick={()=>handleSelect(item)}
                                        className={styles.resultItem}
                                    >
                                        <Image
                                            src={item.posterUrl}
                                            alt={item.title}
                                            width={60}
                                            height={90}
                                            className={styles.poster}
                                        />
                                        <div className={styles.info}>

                                            <h3>
                                                {item.title}
                                            </h3>

                                            <div className={styles.meta}>

                                                <span>
                                                    {item.type === "MOVIE"
                                                        ? "Película"
                                                        : "Serie"
                                                    }
                                                </span>

                                                <span>
                                                    {new Date(item.releaseDate).getFullYear()}
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
                    debouncedQuery.trim() !== "" &&
                    results.length === 0 && (
                        <div className={styles.empty}>
                            No encontramos resultados
                        </div>
                    )
                }
            </div>
        </div>


    )

   
}