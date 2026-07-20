"use client";

import { HeroContent } from "@/entities/types";
import styles from "@/shared/styles/components/HeroBanner.module.css";
import { AnimatePresence, motion, Variants } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

const contentVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.12
        }
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: {
            duration: .35
        }
    }
}satisfies Variants;

const itemVariants = {
    hidden: {
        opacity: 0,
        y: 24
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: .5,
            ease: "easeOut"
        }
    }
} satisfies Variants;

interface Props {
    contents?: HeroContent[];
}

export default function HeroBanner({ contents = [] }: Props) {

    const [index, setIndex] = useState(0);

    useEffect(() => {

        if (contents.length === 0) return;

        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % contents.length);
        }, 8000);

        return () => clearInterval(interval);

        },[contents.length]);


    if (contents.length === 0) return null;

    const content = contents[index];

    return (

        <div className={styles.hero} >

            {/* Imagen Crossfade */}

            <div className={styles.imageWrapper}>

                <AnimatePresence>

                    <motion.div
                        key={content.contentId}
                        className={styles.imageLayer}
                        initial={{
                            opacity:0,
                            scale:1.1
                        }}
                        animate={{
                            opacity:1,
                            scale:1
                        }}
                        exit={{
                            opacity:0,
                            scale:1.1
                        }}
                        transition={{
                            opacity:{
                                duration:1.8,
                                ease:"easeInOut"
                            },
                            scale:{
                                duration:10,
                                ease:"linear"
                            }
                        }}
                    >

                        <Image
                            src={content.backdropUrl}
                            alt=""
                            fill
                            className={styles.backdrop}
                        />

                    </motion.div>

                </AnimatePresence>

            </div>

            <div className={styles.overlay} />

            {/* Contenido */}
            <AnimatePresence mode="sync">

                <motion.div
                    key={`content-${content.contentId}`}
                    className={styles.content}
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >

                    {/* Badges */}

                    <motion.div
                        className={styles.badges}
                        variants={itemVariants}
                    >

                        <span className={styles.badge}>
                            {content.reason}
                        </span>

                        <span className={styles.genre}>
                            {content.type}
                        </span>

                    </motion.div>

                    {/* Título */}

                    <motion.h1
                        className={styles.title}
                        variants={itemVariants}
                    >
                        {content.title}
                    </motion.h1>

                    {/* Descripción */}

                    {content.description && (

                        <motion.p
                            className={styles.description}
                            variants={itemVariants}
                        >
                            {content.description}
                        </motion.p>

                    )}

                    {/* Botones */}

                    <motion.div
                        className={styles.actions}
                        variants={itemVariants}
                    >

                        <button className={styles.btnPrimary}>
                            ▶ Ver
                        </button>

                        <button className={styles.btnSecondary}>
                            Más info
                        </button>

                    </motion.div>

                </motion.div>

            </AnimatePresence>

            {/* Indicadores */}

            <div className={styles.indicators}>

                {contents.map((hero, i) => (

                    <button
                        key={hero.contentId}
                        className={`${styles.dot} ${i === index ? styles.activeDot : ""}`}
                        onClick={() => setIndex(i)}
                        aria-label={`Hero ${i + 1}`}
                    />

                ))}

            </div>

        </div>

    );

}