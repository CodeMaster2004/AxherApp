"use client";
import Cropper, { Area } from "react-easy-crop";
import { useState, useCallback } from "react";
import styles from "@/shared/components/ui/ImageCropModal.module.css";

interface Props {
  image: string;
  onCancel: () => void;
  onSave: (area: Area) => void;
  aspect?: number;
  cropShape?: "rect" | "round";
}

export default function ImageCropModal({
  image,
  onCancel,
  onSave,
  aspect = 1,
  cropShape = "round",
}: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);

  const onCropComplete = useCallback(
    (_: Area, croppedAreaPixels: Area) => {
      setArea(croppedAreaPixels);
    },
    []
  );

  return (
    <div className={styles.cropModal}>
      <div className={styles.cropContainer}>
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          cropShape={cropShape}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>

      <div className={styles.controls}>
        <input
          type="range"
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
        />

        <div className={styles.buttons}>
          <button onClick={onCancel}>Cancelar</button>
          <button onClick={() => area && onSave(area)}>Guardar</button>
        </div>
      </div>
    </div>
  );
}