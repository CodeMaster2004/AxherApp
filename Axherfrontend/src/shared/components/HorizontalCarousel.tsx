"use client";

import {ChevronLeft, ChevronRight } from "lucide-react";
import { ReactNode, useEffect, useRef, useState } from "react";
import styles from "./HorizontalCarousel.module.css";

interface HorizontalCarouselProps {
    children: ReactNode;
    scrollAmount?: number;
}

export default function HorizontalCarousel({ children, scrollAmount = 250,  }: HorizontalCarouselProps){

    const carouselRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const updateButtons = () => {
        if (!carouselRef.current) return;

        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;

        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    }

    const scrollLeft = () => {
        carouselRef.current?.scrollBy({
            left: -scrollAmount,
            behavior: "smooth"
        });
    };

    const scrollRight = () => {
        carouselRef.current?.scrollBy({
            left: scrollAmount,
            behavior: "smooth"
        })
    }

    useEffect(() => {
        requestAnimationFrame(updateButtons);

        window.addEventListener("resize", updateButtons);

        return () => {
            window.removeEventListener("resize", updateButtons);
        };
    }, [children]);

    return (

        <div className={styles.carouselWrapper}>
            {canScrollLeft && (
                <button
                    className={styles.left}
                    onClick={scrollLeft}
                >
                    <ChevronLeft size={28}/>
                </button>
            )}
            <div
                ref={carouselRef}
                className={styles.carousel}
                onScroll={updateButtons}
            >
                {children}
            </div>
            {canScrollRight && (
                <button
                    className={styles.right}
                    onClick={scrollRight}
                >
                    <ChevronRight size={28}/>
                </button>
            )}
        </div>
    )
}


    
        
    
