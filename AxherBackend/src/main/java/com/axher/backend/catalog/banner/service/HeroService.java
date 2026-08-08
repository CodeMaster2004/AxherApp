package com.axher.backend.catalog.banner.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.axher.backend.catalog.banner.entities.HeroBanner;
import com.axher.backend.catalog.banner.repositories.HeroBannerRepository;
import com.axher.backend.content.core.entities.Content;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class HeroService {

    private final HeroBannerRepository heroBannerRepository;


    public List<HeroBanner> getHeroBanners() {

        List<HeroBanner> result = new ArrayList<>();

        LocalDateTime now = LocalDateTime.now();


        // Manuales
        List<HeroBanner> activeBanners =
                heroBannerRepository.findActiveValidBanners(now);


        for(HeroBanner banner : activeBanners){

            if(result.size() >= 5){
                break;
            }

            result.add(banner);
        }



        // Automáticos
        List<Content> automaticContents =
                heroBannerRepository.findHeroContent(Pageable.ofSize(10));


        for(Content content : automaticContents){


            boolean exists = result.stream()
                    .anyMatch(
                        banner ->
                            banner.getContent()
                            .getContentId()
                            .equals(content.getContentId())
                    );


            if(!exists && result.size() < 5){

                HeroBanner automatic = new HeroBanner();

                automatic.setContent(content);
                automatic.setActive(true);
                automatic.setPriority(0);

                result.add(automatic);
            }


            if(result.size() >= 5){
                break;
            }
        }

        return result;
    }
}