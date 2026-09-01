"use client";

import { defaultSupportFaqCategoryIcon, supportFaqCategoryIcons } from "@/shared/constants/supportFaqCategoryIcons";
import styles from "./SupportFaqCategoryCard.module.css";
import { useRouter } from "next/navigation";

interface Category {
    supportCategoryId: number;
    name: string;
    code: string;
}

interface Props {
    category: Category;
}

export default function SupportFaqCategoryCard({
    category,
}: Props) {

    const router = useRouter();

    const Icon = supportFaqCategoryIcons[category.code] ??
    defaultSupportFaqCategoryIcon;

    const handleClick = () => {
        router.push(`/support/faqs/${category.supportCategoryId}`);
    }

    return (
        <article 
            className={styles.card}
            onClick={handleClick}
            role="button"
            tabIndex={0}
        >

            <span
                className={styles.icon}
                aria-hidden="true"
            >
                <Icon />
            </span>

            <h3 className={styles.name}>
                {category.name}
            </h3>

        </article>
    );
}