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
@Table(name = "audio_tracks")
public class AudioTracks {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer audioTrackId;

    @Column(nullable = false)
    private Integer contentId;  // Puede referirse a Película, Serie, Temporada o Episodio


    @Column(nullable = false, length = 50)
    private String language;

    @Column(length = 50)
    private String format;  // Ej: 'Dolby', 'Stereo'

}

