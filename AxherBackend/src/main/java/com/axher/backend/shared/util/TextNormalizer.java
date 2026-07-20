package com.axher.backend.shared.util;

public class TextNormalizer {

    private TextNormalizer() {} // evita instancias

    public static String normalize(String text) {
        return text == null ? null : text.trim().toLowerCase();
    }
    
}
