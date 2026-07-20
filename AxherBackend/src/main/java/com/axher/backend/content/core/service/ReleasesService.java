package com.axher.backend.content.core.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.axher.backend.content.core.entities.Releases;
import com.axher.backend.content.core.repositories.ReleasesRepository;

@Service
public class ReleasesService {
    private ReleasesRepository releasesRepository;

    public List<Releases> getAllReleases(){
        return releasesRepository.findAll();
    }

    public Releases saveReleases(Releases release){
        return releasesRepository.save(release);
    }

    public Optional<Releases> getReleaseById(Integer id){
        return releasesRepository.findById(id);
    }

    public void deleteReleases(Integer id){
        releasesRepository.deleteById(id);
    }
}
    
