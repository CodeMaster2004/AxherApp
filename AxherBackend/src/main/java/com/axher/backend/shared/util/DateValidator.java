package com.axher.backend.shared.util;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class DateValidator {

    private DateValidator() {}

    public static void validateDateRange(LocalDate start, LocalDate end) {

        if (start == null || end == null) {
            throw new IllegalArgumentException(
                "Las fechas de inicio y fin son obligatorias"
            );
        }

        if (end.isBefore(start)) {
            throw new IllegalArgumentException(
                "La fecha de fin no puede ser anterior a la fecha de inicio"
            );
        }
    }

    public static void validateDateTimeRange(
            LocalDateTime start,
            LocalDateTime end
    ) {

        if (start != null &&
            end != null &&
            end.isBefore(start)) {

            throw new IllegalArgumentException(
                "La fecha de fin no puede ser anterior a la fecha de inicio"
            );
        }
    }

}
