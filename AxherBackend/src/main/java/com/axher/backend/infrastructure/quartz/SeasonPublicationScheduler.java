package com.axher.backend.infrastructure.quartz;

import java.time.Instant;

import org.quartz.SchedulerException;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SeasonPublicationScheduler {
    
    private final QuartzSchedulerService quartz;

    public void schedule(Integer seasonId, Instant date) throws SchedulerException{

        quartz.schedule(
            "publish-season-" + seasonId,
            "season",
            PublishSeasonJob.class,
            "seasonId",
            seasonId,
            date
        );
    }

    public void cancel(Integer seasonId) throws SchedulerException{
        quartz.cancel(
            "publish-season-" + seasonId,
            "season"
        );
    }
}
