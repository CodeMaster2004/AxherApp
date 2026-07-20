"use client";

import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

export interface UseVideoPlayer {

    playing: boolean;

    progress: number;

    currentTime: number;

    duration: number;

    volume: number;

    showControls: boolean;

    togglePlay: () => void;

    back10: () => void;

    forward10: () => void;

    seek: (value: number) => void;

    changeVolume: (value: number) => void;

    fullscreen: () => void;

    format: (seconds: number) => string;

    showTemporarily: () => void;

     resetPlayer: () => void;

}

export function useVideoPlayer(
    video: HTMLVideoElement | null
): UseVideoPlayer {

    const [playing, setPlaying] = useState(false);

    const [progress, setProgress] = useState(0);

    const [currentTime, setCurrentTime] = useState(0);

    const [duration, setDuration] = useState(0);

    const [volume, setVolume] = useState(1);

    const [showControls, setShowControls] = useState(true);

    const timeout = useRef<NodeJS.Timeout | null>(null);

    const showTemporarily = useCallback(() => {

        setShowControls(true);

        if (timeout.current) {

            clearTimeout(timeout.current);

        }

        timeout.current = setTimeout(() => {

            setShowControls(false);

        }, 3000);

    }, []);

    useEffect(() => {


        if (!video) return;

        const update = () => {

            setCurrentTime(video.currentTime);

            setDuration(
                Number.isFinite(video.duration)
                    ? video.duration
                    : 0
            );

            setProgress(
                video.duration
                    ? (video.currentTime / video.duration) * 100
                    : 0
            );

            setPlaying(
                !video.paused && !video.ended
            );

        };

        video.addEventListener("timeupdate", update);
        video.addEventListener("play", update);
        video.addEventListener("pause", update);
        video.addEventListener("loadedmetadata", update);
        video.addEventListener("loadeddata", update);
        video.addEventListener("durationchange", update);
        video.addEventListener("seeking", update);
        video.addEventListener("seeked", update);
        video.addEventListener("ended", update);

        update();

        return () => {

            video.removeEventListener("timeupdate", update);
            video.removeEventListener("play", update);
            video.removeEventListener("pause", update);
            video.removeEventListener("loadedmetadata", update);
            video.removeEventListener("loadeddata", update);
            video.removeEventListener("durationchange", update);
            video.removeEventListener("seeking", update);
            video.removeEventListener("seeked", update);
            video.removeEventListener("ended", update);

        };

    }, [video]);

    const togglePlay = async () => {


        if (!video) return;


        try {

            if (video.ended) {

                video.currentTime = 0;

            }


            if (video.paused) {

                await video.play();

            } else {

                video.pause();

            }


        } catch(error){

            console.error(error);

        }

    };

    const back10 = () => {


        if (!video) return;

        video.currentTime = Math.max(
            0,
            video.currentTime - 10
        );

    };

    const forward10 = () => {


        if (!video) return;

        video.currentTime = Math.min(
            video.duration,
            video.currentTime + 10
        );

    };

    const seek = (value:number)=>{


        if(!video)return;


        const time =
            (value / 100) * video.duration;


        video.currentTime = time;

        setCurrentTime(time);

        setProgress(value);

    };

    const changeVolume = (value: number) => {


        if (!video) return;

        video.volume = value;

        setVolume(value);

    };

    const resetPlayer = () => {

        setPlaying(false);

        setProgress(0);

        setCurrentTime(0);

        setDuration(0);

    };

    const fullscreen = () => {


        if (!video) return;


        const container = video.parentElement;


        if (!container) return;


        if (!document.fullscreenElement) {

            container.requestFullscreen();

        } else {

            document.exitFullscreen();

        }

    };

    const format = (seconds: number) => {

        if (!seconds || Number.isNaN(seconds)) {

            return "00:00";

        }

        const hrs = Math.floor(seconds / 3600);

        const mins = Math.floor((seconds % 3600) / 60);

        const secs = Math.floor(seconds % 60);

        if (hrs > 0) {

            return `${hrs}:${mins
                .toString()
                .padStart(2, "0")}:${secs
                .toString()
                .padStart(2, "0")}`;

        }

        return `${mins
            .toString()
            .padStart(2, "0")}:${secs
            .toString()
            .padStart(2, "0")}`;

    };

    useEffect(() => {

        showTemporarily();

    }, [showTemporarily]);

    useEffect(() => {

        const handleKey = (e: KeyboardEvent) => {

            switch (e.key.toLowerCase()) {

                case " ":

                    e.preventDefault();

                    togglePlay();

                    break;

                case "arrowleft":

                    back10();

                    break;

                case "arrowright":

                    forward10();

                    break;

                case "f":

                    fullscreen();

                    break;

                case "m":

                    changeVolume(volume > 0 ? 0 : 1);

                    break;

            }

            showTemporarily();

        };

        window.addEventListener(
            "keydown",
            handleKey
        );

        return () =>
            window.removeEventListener(
                "keydown",
                handleKey
            );

    }, [volume, showTemporarily]);

    return {

        playing,

        progress,

        currentTime,

        duration,

        volume,

        showControls,

        togglePlay,

        back10,

        forward10,

        seek,

        changeVolume,

        fullscreen,

        format,

        showTemporarily,

        resetPlayer,

    };

}