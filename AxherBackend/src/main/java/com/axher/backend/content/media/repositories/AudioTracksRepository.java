package com.axher.backend.content.media.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.content.media.entities.AudioTracks;

public interface AudioTracksRepository extends JpaRepository<AudioTracks, Integer> {

}
