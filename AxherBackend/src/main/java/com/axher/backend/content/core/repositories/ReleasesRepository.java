package com.axher.backend.content.core.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.content.core.entities.Releases;

public interface ReleasesRepository extends JpaRepository <Releases, Integer>{

}
