"use client";

import { Shelf } from "@/entities/types";
import Image from "next/image";
import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import styles from "./FeaturedShelf.module.css";

interface Props {
    shelf: Shelf;
}

const CLONE_COUNT = 2;
const AUTO_ADVANCE_MS = 5000;

function buildLoopedContents(contents: Shelf["contents"]) {
    if (contents.length === 0) {
        return [];
    }

    return [
        ...contents.slice(-CLONE_COUNT),
        ...contents,
        ...contents.slice(0, CLONE_COUNT),
    ];
}

export default function FeaturedShelf({ shelf }: Props) {
    const viewportRef = useRef<HTMLElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    const loopedContents = useMemo(
        () => buildLoopedContents(shelf.contents),
        [shelf.contents]
    );

    const [activeIndex, setActiveIndex] = useState(CLONE_COUNT);
    const [animate, setAnimate] = useState(false);
    const [metrics, setMetrics] = useState({
        cardWidth: 0,
        containerWidth: 0,
        slideStep: 0,
    });

    const realStartIndex = CLONE_COUNT;
    const realEndIndex = realStartIndex + Math.max(shelf.contents.length - 1, 0);

    const measure = useCallback(() => {
        const viewport = viewportRef.current;
        const track = trackRef.current;

        if (!viewport || !track) {
            return;
        }

        const card = track.querySelector<HTMLElement>(
            `[data-slide-index="${realStartIndex}"]`
        );

        if (!card) {
            return;
        }

        const gap = Number.parseFloat(window.getComputedStyle(track).gap || "0");
        const cardWidth = card.offsetWidth;

        setMetrics({
            cardWidth,
            containerWidth: viewport.clientWidth,
            slideStep: cardWidth + gap,
        });
    }, [realStartIndex]);

    useLayoutEffect(() => {
        if (!loopedContents.length) {
            return;
        }

        measure();

        const resizeObserver =
            typeof ResizeObserver !== "undefined" && viewportRef.current
                ? new ResizeObserver(measure)
                : null;

        if (resizeObserver && viewportRef.current) {
            resizeObserver.observe(viewportRef.current);
        }

        const rafId = window.requestAnimationFrame(() => {
            setAnimate(true);
        });

        window.addEventListener("resize", measure);

        return () => {
            window.removeEventListener("resize", measure);
            resizeObserver?.disconnect();
            window.cancelAnimationFrame(rafId);
        };
    }, [loopedContents.length, measure]);

    useEffect(() => {
        setActiveIndex(CLONE_COUNT);
    }, [shelf.contents.length]);

    useEffect(() => {
        if (shelf.contents.length <= 1) {
            return;
        }

        const intervalId = window.setInterval(() => {
            setActiveIndex((currentIndex) => currentIndex + 1);
        }, AUTO_ADVANCE_MS);

        return () => {
            window.clearInterval(intervalId);
        };
    }, [shelf.contents.length]);

    const jumpToIndex = (nextIndex: number) => {
        setAnimate(false);
        setActiveIndex(nextIndex);

        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
                setAnimate(true);
            });
        });
    };

    const handleTransitionEnd = () => {
        if (shelf.contents.length === 0) {
            return;
        }

        if (activeIndex > realEndIndex) {
            jumpToIndex(realStartIndex);
            return;
        }

        if (activeIndex < realStartIndex) {
            jumpToIndex(realEndIndex);
        }
    };

    if (shelf.contents.length === 0) {
        return null;
    }

    const translateX = metrics.containerWidth && metrics.slideStep
        ? metrics.containerWidth / 2 - (
            activeIndex * metrics.slideStep + metrics.cardWidth / 2
        )
        : 0;

    return (
        <section
            ref={viewportRef}
            className={styles.section}
        >
            <div
                ref={trackRef}
                className={styles.row}
                data-animate={animate}
                onTransitionEnd={handleTransitionEnd}
                style={{
                    transform: `translateX(${translateX}px)`,
                }}
            >
                {loopedContents.map((content, index) => {
                    const isActive = index === activeIndex;

                    return (
                        <div
                            key={`${content.contentId}-${index}`}
                            data-slide-index={index}
                            className={isActive ? `${styles.card} ${styles.cardActive}` : styles.card}
                        >
                            <Image
                                src={content.backdropUrl}
                                alt={content.title}
                                fill
                                className={styles.image}
                                sizes="(max-width: 768px) 85vw, (max-width: 1280px) 45vw, 40vw"
                                priority={index === CLONE_COUNT}
                            />
                        </div>
                    );
                })}
            </div>
        </section>
    );
}