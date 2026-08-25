"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import VideoControls from "./VideoControls";
import styles from "./VideoPlayerModal.module.css";
import { useVideoPlayer } from "@/features/media/hooks/useVideoPlayer";
import { usePlaybackProgress } from "@/features/playbackHistory/hooks/usePlaybackProgress";
import ProblemReportModal from "@/features/reports/components/ProblemReportModal";
import { useTranslations } from "next-intl";

interface Props {
    isOpen: boolean;
    title?: string;
    src: string;

    contentId: number;
    episodeId?: number;

    onClose: () => void;
}

export default function VideoPlayerModal({
    isOpen,
    title,
    src,
    contentId,
    episodeId,
    onClose,
}: Props) {

    const t = useTranslations("media");
    const [videoElement, setVideoElement] =
        useState<HTMLVideoElement | null>(null);

    const player = useVideoPlayer(videoElement);
    const [mounted, setMounted] = useState(false);
    const playback = usePlaybackProgress();
    const lastSaved = useRef(0);
    const [showReportModal, setShowReportModal] = useState(false);
    
    const handleClose = useCallback(async () => {

        if (!videoElement) {
            onClose();
            return;
        }


        const current = Math.floor(
            videoElement.currentTime
        );


        try {

            if(current > 0){

                await playback.saveProgress({
                    contentId,
                    episodeId,
                    watchedSeconds: current,
                });

            }

        } catch(err){

            console.error(
                "Error guardando progreso:",
                err
            );

        } finally {

            videoElement.pause();
            onClose();

        }


    },[
        videoElement,
        playback,
        contentId,
        episodeId,
        onClose
    ]);

    useEffect(() => {
        setMounted(true);
    }, []);


    // ESC + bloquear scroll
    useEffect(() => {

        if (!isOpen) return;

        document.body.style.overflow = "hidden";

        const escape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                handleClose();
            }
        };

        window.addEventListener("keydown", escape);

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", escape);
        };

    }, [isOpen, handleClose]);


    // Cargar progreso inicial 
    useEffect(() => {

        if (!isOpen || !videoElement) return;

         let cancelled = false;
        lastSaved.current = 0;

        player.resetPlayer();

       const initialize = async() => {
            try{
                const history = await playback.loadProgress(
                    contentId,
                    episodeId
                );

                console.log("Historial:", history);

                if(cancelled) return;

                if(history?.watchedSeconds){
                    videoElement.currentTime = history.watchedSeconds;
                }

                await videoElement.play();
            }catch(err: unknown){

                if(err instanceof Error && err.name != "AbortError"){
                    console.error("Error cargando historial:", err);
                }
            }
       };

       player.resetPlayer();

        if (videoElement.readyState >= 1) {
            initialize();
        } else {
            videoElement.onloadedmetadata = initialize;
        }

        return () => {

            cancelled = true;
            videoElement.onloadedmetadata = null;

        };

    }, [isOpen, src, videoElement, contentId, episodeId]);


    // Guardar el progreso cada 10 segundos
    useEffect(() => {

        if(!isOpen || !videoElement) return;
        
        const interval = setInterval(() => {

            const current = Math.floor(videoElement.currentTime);

            if (
                !videoElement.paused &&
                !videoElement.ended && 
                current > 0 &&
                current !== lastSaved.current
            ){
                lastSaved.current = current;

                playback.saveProgress({
                    contentId,
                    episodeId,
                    watchedSeconds: current,
                }).catch(console.error);
            }
        }, 10000);
        return () => clearInterval(interval);

    }, [isOpen, videoElement, contentId, episodeId, playback]);

    if (!isOpen || !mounted) {
        return null;
    }

    return createPortal(

        <div
            className={`${styles.overlay} ${
                !player.showControls
                    ? styles.overlayHideCursor
                    : ""
            }`}
            onMouseMove={player.showTemporarily}
        >

            <header
                className={`${styles.header} ${
                    player.showControls
                        ? styles.visible
                        : styles.hidden
                }`}
            >
                <button
                    className={styles.back}
                    onClick={handleClose}
                >
                    ← {t("player.exit")}
                </button>

                <h2 className={styles.title}>
                    {title}
                </h2>
               
            </header>

            <video
                ref={setVideoElement}
                src={src}
                className={`${styles.video} ${
                    !player.showControls ? styles.hideCursor : ""
                }`}
                playsInline
            />

            <VideoControls 
                player={player} 
                onReportProblem={() => setShowReportModal(true)}
            />
            <ProblemReportModal
                isOpen={showReportModal}
                contentId={contentId}
                episodeId={episodeId}
                onClose={() => setShowReportModal(false)}
            />

        </div>,

        document.body

    );
}
