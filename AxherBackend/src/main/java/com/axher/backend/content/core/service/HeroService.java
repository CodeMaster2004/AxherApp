package com.axher.backend.content.core.service;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.axher.backend.content.core.DTOs.HeroContentDto;
import com.axher.backend.content.core.mapper.HeroMapper;
import com.axher.backend.content.core.repositories.HeroRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HeroService {

    private final HeroRepository repository;
    private final HeroMapper mapper;

    public List<HeroContentDto> getHeroContent() {

        List<HeroContentDto> heroes =
                repository.findHeroRanking(Pageable.ofSize(5));

        heroes.forEach(hero -> {
            mapper.map(hero);
            assignReason(hero);
        });

        return heroes;
    }

    private void assignReason(HeroContentDto dto) {

        if (dto.getAverageRating() >= 4.8) {
            dto.setReason("⭐ Muy bien valorada");
        } else if (dto.getTotalViews() >= 1000) {
            dto.setReason("🔥 Popular ahora");
        } else {
            dto.setReason("🎬 Destacada");
        }
    }
    
}

