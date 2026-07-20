package com.axher.backend.content.media.service;

import java.io.BufferedReader;
import java.io.InputStreamReader;

import org.springframework.stereotype.Service;

@Service
public class VideoMetadataService {
    
    public Integer getDurationMinutes(String filePath){

        try {
            
            ProcessBuilder processBuilder = new ProcessBuilder(
                "ffprobe",
                "-v",
                "error",
                "-show_entries",
                "format=duration",
                "-of",
                "default=noprint_wrappers=1:nokey=1",
                filePath
            );

            Process process = processBuilder.start();

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));

            String result = reader.readLine();

            process.waitFor();

            if(result == null){
                throw new RuntimeException("No se pudo obtener duración del video");
            }

            double seconds = Double.parseDouble(result);

            return (int)Math.round(seconds);
        }catch(Exception e){

            throw new RuntimeException("Error leyendo metadata del video", e);
        }
    }
}
