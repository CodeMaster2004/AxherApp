"use client";

import { Category } from "@/entities/types";
import { useRouter } from "next/navigation";
import styles from "./GenreBar.module.css";

interface Props {
    categories: Category[];
    basePath: string;
}

export default function GenreBar({ categories, basePath }: Props) {

    const router = useRouter();

    return (

        <nav className={styles.filterPills}>
            {categories.map(category => (
                <button
                    key={category.categoryId}
                    className={styles.pill}
                    onClick={() =>
                            router.push(
                                `${basePath}/genero/${category.slug}`
                            )
                        }
                >
                    {category.name}
                </button>
            ))}
        </nav>
    )
}