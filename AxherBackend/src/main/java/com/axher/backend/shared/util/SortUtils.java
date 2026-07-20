package com.axher.backend.shared.util;

import java.util.Set;

import org.springframework.data.domain.Sort;

public class SortUtils {

    public static Sort parseSort(String sort, Set<String> allowedFields, String defaultField) {
        if (sort == null || sort.isBlank()) {
            return Sort.by(Sort.Direction.DESC, defaultField);
        }

        String[] parts = sort.split(",");
        String field = parts[0].trim();

        if (!allowedFields.contains(field)) {
            field = defaultField;
        }

        Sort.Direction direction =
            parts.length > 1 && parts[1].trim().equalsIgnoreCase("desc")
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;

        return Sort.by(direction, field);
    }

}