package com.axher.backend.content.core.DTOs;

import com.axher.backend.content.core.entities.Content;

public record TrendingContentResult(
    Content content,
    Long totalViews,
    Long uniqueUsers,
    Long totalWatchedSeconds,
    Double score
) {

}
