"use client";

import styles from "./VideoControls.module.css";

import {
    Pause,
    Play,
    RotateCcw,
    RotateCw,
    Volume2,
    Maximize2,
} from "lucide-react";

import { UseVideoPlayer } from "@/features/media/hooks/useVideoPlayer";

interface Props {
    player: UseVideoPlayer;
}

export default function VideoControls({ player }: Props) {

       
    return (

        <div
            className={`${styles.controls} ${
                player.showControls ? styles.visible : styles.hidden
            }`}
        >

            {/* Barra de progreso */}

            <input
                className={styles.progress}
                type="range"
                min={0}
                max={100}
                value={player.progress}
                style={{
                    background: `linear-gradient(
                        to right,
                        #e50914 0%,
                        #e50914 ${player.progress}%,
                        rgba(255,255,255,.18) ${player.progress}%,
                        rgba(255,255,255,.18) 100%
                    )`,
                }}
                onChange={(e) =>
                    player.seek(Number(e.target.value))
                }
            />

            <div className={styles.bottom}>

                <div className={styles.left}>

                    <button
                        className={styles.iconButton}
                        onClick={player.back10}
                    >
                        <RotateCcw size={20}/>
                    </button>

                    <button
                        className={`${styles.playButton} ${styles.iconButton}`}
                        onClick={player.togglePlay}
                    >
                        {player.playing
                            ? <Pause size={30}/>
                            : <Play size={30}/>
                        }
                    </button>

                    <button
                        className={styles.iconButton}
                        onClick={player.forward10}
                    >
                        <RotateCw size={20}/>
                    </button>

                    <span className={styles.time}>

                        {player.format(player.currentTime)}

                        {" / "}

                        {player.format(player.duration)}

                    </span>

                </div>

                <div className={styles.right}>

                    <Volume2 size={20}/>

                    <input
                        className={styles.volume}
                        type="range"
                        min={0}
                        max={1}
                        step={0.05}
                        value={player.volume}
                        onChange={(e)=>
                            player.changeVolume(
                                Number(e.target.value)
                            )
                        }
                    />

                    <button
                        className={styles.iconButton}
                        onClick={player.fullscreen}
                    >
                        <Maximize2 size={20}/>
                    </button>

                </div>

            </div>

        </div>

    );

}