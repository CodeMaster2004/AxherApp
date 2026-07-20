package com.axher.backend.infrastructure.storage;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class LocalFileStorageService implements FileStorageService{

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @Override
    public String saveFile(MultipartFile file, String folder) {
        try {

            if (file.isEmpty()) {
                throw new RuntimeException("Archivo vacío");
            }

            // Normalizar nombre
            String originalName = file.getOriginalFilename();
            String safeName = originalName
                    .replaceAll("\\s+", "_")
                    .replaceAll("[^a-zA-Z0-9._-]", "");

            String fileName = System.currentTimeMillis() + "_" + safeName;

            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Path folderPath = uploadPath.resolve(folder);

            // 🔴 Crear carpetas SIEMPRE (más seguro que exists)
            Files.createDirectories(folderPath);

            Path filePath = folderPath.resolve(fileName);

            file.transferTo(filePath.toFile());

            return folder + "/" + fileName;

        } catch (IOException e) {
            throw new RuntimeException("Error al guardar archivo", e);
        }
    }


    @Override
    public void deleteFile(String fileUrl){
        if(fileUrl == null || fileUrl.isEmpty()){
            return;
        }

        try{
            String relativePath = fileUrl.replace("/media/", "");
            Path filePath = Paths.get(uploadDir).resolve(relativePath);
            Files.deleteIfExists(filePath);
        }catch(IOException e){
            //log error pero no lanzar exeption
            System.err.println("Error al eliminar el archivo: " + fileUrl);
        }
    }

    @Override
    public String getPublicUrl(String fileName){
        return "/uploads/" + fileName;
    }

    @Override
    public String getAbsolutePath(String fileUrl){

        return Paths
            .get(uploadDir)
            .resolve(fileUrl)
            .toAbsolutePath()
            .toString();
    }
}

