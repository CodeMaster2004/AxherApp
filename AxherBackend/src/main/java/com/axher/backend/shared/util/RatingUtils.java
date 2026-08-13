package com.axher.backend.shared.util;

public final class RatingUtils {

    private RatingUtils(){}

    public static double bayesianRating(
        double averageRating,
        long totalRatings,
        double globalAverage,
        int minimumRatings
    ){
        double v = totalRatings;
        double r = averageRating;
        double m = minimumRatings;

        return 
            ((v/(v+m))*r)
            +
            ((m/(v+m))*globalAverage);
    }
    
}
