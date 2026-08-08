package com.axher.backend.shared.util;

public class TextNormalizer {

    private TextNormalizer() {} // evita instancias

    public static String normalize(String text) {
        return text == null ? null : text.trim().toLowerCase();
    }

    public static String normalizeCode(String text) {
        return text == null ? null : text.trim().toUpperCase();
    }

    public static String normalizeSlug(String text){

        return text.trim()
                .toLowerCase()
                .replace(" ", "-")
                .replaceAll("[^a-z0-9-]", "");
    }
    
}
