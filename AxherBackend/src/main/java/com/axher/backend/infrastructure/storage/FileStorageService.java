package com.axher.backend.infrastructure.storage;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {

    /*Guada un archivo y retorna la URL/path donde se guardo */
    String saveFile(MultipartFile file, String folder);

    /*Elimina un archivo dado se URL/path */
    void deleteFile(String fileUrl);

    /*Obtiene la URL publica de un archivo */
    String getPublicUrl(String fileName);

    String getAbsolutePath(String fileUrl);
}
