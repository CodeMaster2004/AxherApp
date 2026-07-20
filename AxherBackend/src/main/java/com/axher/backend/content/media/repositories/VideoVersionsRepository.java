package com.axher.backend.content.media.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.content.media.entities.VideoVersions;

public interface VideoVersionsRepository extends JpaRepository<VideoVersions, Integer> {

}
