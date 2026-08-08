package com.axher.backend.shared.util;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SlugGeneratorService {


    public String generate(String text, SlugChecker checker){

        String base = TextNormalizer.normalizeSlug(text);

        String slug = base;
        int counter = 1;


        while(checker.existsBySlug(slug)){

            slug = base + "-" + counter;
            counter++;
        }


        return slug;
    }
}