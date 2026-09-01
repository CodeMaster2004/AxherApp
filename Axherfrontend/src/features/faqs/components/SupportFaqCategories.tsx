"use client";

import SupportFaqCategoryCard from "./SupportFaqCategoryCard";

import styles from "./SupportFaqCategories.module.css";
import { SupportCategoryResponse } from "@/entities/types";



interface Props {
    categories: SupportCategoryResponse[];
}

export default function SupportFaqCategories({
    categories,
}: Props) {

    return (
        <div className={styles.grid}>

            {categories.map((category) => (
                <SupportFaqCategoryCard
                    key={category.supportCategoryId}
                    category={category}
                />
            ))}

        </div>
    );
}