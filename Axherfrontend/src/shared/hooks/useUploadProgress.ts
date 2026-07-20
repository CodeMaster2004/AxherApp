import { useState, useCallback } from "react";
import { AxiosProgressEvent } from "axios";

export function useUploadProgress() {
  const [progress, setProgress] = useState(0);

  const handleProgress = useCallback((event: AxiosProgressEvent) => {
    if (event.total) {
      const percent = Math.round((event.loaded * 100) / event.total);
      setProgress(percent);
    }
  }, []);

  const resetProgress = useCallback(() => setProgress(0), []);

  return { progress, handleProgress, resetProgress };
}