package com.axher.backend.content.playback.entities;

import java.time.LocalDateTime;

import com.axher.backend.content.core.entities.Content;
import com.axher.backend.content.series.entities.Episodes;
import com.axher.backend.users.entities.Users;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "playback_history")
public class PlaybackHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer playbackHistoryId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

    @ManyToOne
    @JoinColumn(name = "content_id")
    private Content content;

    @ManyToOne
    @JoinColumn(name = "episode_id")
    private Episodes episode;

    @Column(nullable = false)
    private Integer watchedSeconds; 

    @Column(columnDefinition = "DATETIME")
    private LocalDateTime watchedAt;

}

