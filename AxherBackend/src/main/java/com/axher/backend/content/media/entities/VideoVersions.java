package com.axher.backend.content.media.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "video_versions")
public class VideoVersions {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer videoVersionId;

    @Column(nullable = false)
    private Integer contentId;  // Puede referirse a Película, Serie, Temporada o Episodio



    @Column(nullable = false, length = 20)
    private String resolution;  // Ej: '720p', '1080p', '4K'

    @Column(length = 20)
    private String format;  // Ej: 'MP4', 'MKV'

    @Column(nullable = false, columnDefinition = "NVARCHAR(MAX)")
    private String videoUrl;

}

