"use client";

import { X } from "lucide-react";
import { useState } from "react";
import styles from "./Search.module.css"
import { useGlobalSearch } from "@/features/search/hooks/UseGlobalSearch";
import { useRouter } from "next/navigation";
import { ContentDetail } from "@/entities/types";
import Image from "next/image";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useSearchHistoryActions } from "@/features/search/hooks/useSearchHistoryActions";
import { useSearchHistory } from "@/features/search/hooks/useSearchHistory";

interface Props {
    onClose: () => void;
}

export default function SearchModal({ onClose }: Props) {

    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const debouncedQuery = useDebounce(query, 500);
    const { results, loading } = useGlobalSearch(debouncedQuery.trim());
    const router = useRouter();
    const { save, remove } = useSearchHistoryActions();
    const {
        searchHistory,
        loading: historyLoading,
        refetch: refetchHistory
    } = useSearchHistory();

    const handleSelect = async(item: ContentDetail) => {

        const term = query.trim();

        if (term) {
            try {
                await save({ term });
            } catch {
                // El historial no debe bloquear la navegación
            }
        }

        onClose();

        if(item.type === "MOVIE") {
            router.push(`/peliculas/${item.contentId}`);
        }

        if(item.type === "SERIE") {
            router.push(`/serie/${item.contentId}`);
        }
    }

    const handleRemoveHistory = async(
        e: React.MouseEvent,
        searchId: number
    ) => {
        e.stopPropagation();

        try {
            await remove(searchId);
            await refetchHistory();
        }catch{}
    };
    
    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {

        if (e.key === "Escape") {
            onClose();
            return;
        }

        if (e.key === "ArrowDown") {

            if (results.length === 0) return;

            e.preventDefault();

            setSelectedIndex(prev =>
                prev < results.length - 1
                    ? prev + 1
                    : 0
            );

            return;
        }

        if (e.key === "ArrowUp") {

            if (results.length === 0) return;

            e.preventDefault();

            setSelectedIndex(prev =>
                prev > 0
                    ? prev - 1
                    : results.length - 1
            );

            return;
        }

        if (e.key === "Enter") {

            if (results.length === 0) return;

            e.preventDefault();

            handleSelect(results[selectedIndex]);
            return;
        }

    };
    const handleQueryChange = (value: string) => {
        setQuery(value);
        setSelectedIndex(0);
    };

    const handleViewAllHistory = () => {
        onClose();
        router.push("/historial-busquedas");
    };
    
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
                    onChange={e => handleQueryChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    
                    placeholder="Buscar peliculas o series..."
                />
                {
                    query.trim() === "" && (
                        <div className={styles.history}>

                            <div className={styles.historyHeader}>
                                <h3>Búsquedas recientes</h3>
                            </div>

                            {
                                historyLoading ? (
                                    <div className={styles.loading}>
                                        Cargando historial...
                                    </div>
                                ) : searchHistory.length > 0 ? (

                                    <>
                                        <div className={styles.historyList}>

                                            {
                                                searchHistory.map((item) => (
                                                    <div
                                                        key={item.searchId}
                                                        className={styles.historyItem}
                                                    >

                                                        <button
                                                            type="button"
                                                            className={styles.historyTerm}
                                                            onClick={() => handleQueryChange(item.term)}
                                                        >
                                                            {item.term}
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className={styles.historyDelete}
                                                            onClick={(e) =>
                                                                handleRemoveHistory(e, item.searchId)
                                                            }
                                                            aria-label={`Eliminar ${item.term}`}
                                                        >
                                                            <X size={16} />
                                                        </button>

                                                    </div>
                                                ))
                                            }

                                        </div>
                                        <button
                                            type="button"
                                            className={styles.viewAllHistory}
                                            onClick={handleViewAllHistory}
                                        >
                                            Ver todo el historial
                                            <span>→</span>
                                        </button>
                                    </>
                                    
                                ) : (
                                    <div className={styles.empty}>
                                        No tienes búsquedas recientes
                                    </div>
                                )
                            }

                        </div>
                    )
                }

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
                                results.map((item, index)=>(
                                    <article 
                                        key={item.contentId}
                                        onClick={()=>handleSelect(item)}
                                        className={`${styles.resultItem} ${
                                            index === selectedIndex
                                                ? styles.selected
                                                : ""
                                        }`}
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