package com.axher.backend.infrastructure.quartz;

import java.time.LocalDateTime;

import org.quartz.SchedulerException;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class EpisodePublicationScheduler {

    private final QuartzSchedulerService quartz;

    public void schedule(Integer episodeId, LocalDateTime date) throws SchedulerException {

        log.info("Scheduler -> episodio={}, fecha={}", episodeId, date);
        quartz.schedule(
            "publish-episode-" + episodeId,
            "episode",
            PublishEpisodeJob.class,
            "episodeId",
            episodeId,
            date
        );
    }

    public void cancel(Integer episodeId) throws SchedulerException {
        quartz.cancel(
            "publish-episode-" + episodeId,
            "episode"
        );
    }

    
}
