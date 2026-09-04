package com.axher.backend.catalog.banner.service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.axher.backend.catalog.banner.DTOs.HeroRankedCandidateDto;
import com.axher.backend.catalog.banner.entities.HeroBanner;
import com.axher.backend.catalog.banner.repositories.HeroBannerRepository;
import com.axher.backend.content.core.entities.Content;
import com.axher.backend.content.core.repositories.ContentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HeroService {

    private static final int MAX_HERO_ITEMS = 5;

    private final HeroBannerRepository heroBannerRepository;
    private final HeroRankingService heroRankingService;
    private final ContentRepository contentRepository;


    public List<HeroBanner> getHeroBanners() {

        List<HeroBanner> result = new ArrayList<>();

        Instant now = Instant.now();


        // Manuales
        List<HeroBanner> activeBanners =
                heroBannerRepository.findActiveValidBanners(now);

        Set<Integer> usedContentIds = new HashSet<>();
        for(HeroBanner banner : activeBanners){

            if(result.size() >= MAX_HERO_ITEMS){
                break;
            }

            Integer contentId = banner.getContent().getContentId();

            if(usedContentIds.add(contentId)){
                result.add(banner);
            }
        }



        // Automáticos
        if(result.size() < MAX_HERO_ITEMS){

            List<HeroRankedCandidateDto> rankedCandidates = heroRankingService.rank();

            List<Integer> automaticContentIds = 
                    rankedCandidates.stream()
                            .map(HeroRankedCandidateDto::getContentId)
                            .filter(id -> !usedContentIds.contains(id))
                            .limit(MAX_HERO_ITEMS - result.size())
                            .toList();
            if(!automaticContentIds.isEmpty()){

                List<Content> contents = contentRepository.findAllByContentIdIn(automaticContentIds);

                Map<Integer, Content> contentMap =
                        contents.stream()
                                .collect(
                                    java.util.stream.Collectors.toMap(
                                        Content::getContentId,
                                        content -> content
                                    )
                                );
                for(Integer contentId : automaticContentIds){
                    
                    if(result.size() >= MAX_HERO_ITEMS){
                        break;
                    }

                    Content content = contentMap.get(contentId);
                    
                    if(content == null){
                        continue;
                    }

                    HeroBanner automatic = new HeroBanner();

                    automatic.setContent(content);
                    automatic.setActive(true);
                    automatic.setPriority(0);

                    result.add(automatic);
                    usedContentIds.add(contentId);
                    
                }
            }
        }
        return result;
        
    }
}